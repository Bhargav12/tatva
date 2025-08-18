import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/middleware'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Logger middleware
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Test route
app.get('/make-server-eb1a20a7/test', (c) => {
  return c.json({ message: 'BlogHub server is running!' })
})

// User signup
app.post('/make-server-eb1a20a7/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: `Signup failed: ${error.message}` }, 400)
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
      posts_count: 0
    })

    return c.json({ 
      message: 'User created successfully',
      user: { id: data.user.id, email: data.user.email, name }
    })
  } catch (error) {
    console.log('Signup error during user creation:', error)
    return c.json({ error: 'Failed to create user account' }, 500)
  }
})

// Get user profile
app.get('/make-server-eb1a20a7/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`user:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log('Profile fetch error:', error)
    return c.json({ error: 'Failed to fetch user profile' }, 500)
  }
})

// Create a new post
app.post('/make-server-eb1a20a7/posts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized - please log in to submit posts' }, 401)
    }

    const postData = await c.req.json()
    const postId = crypto.randomUUID()
    
    const post = {
      ...postData,
      id: postId,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save post to KV store
    await kv.set(`post:${postId}`, post)
    
    // Add to user's posts list
    const userPostsKey = `user_posts:${user.id}`
    const userPosts = await kv.get(userPostsKey) || []
    await kv.set(userPostsKey, [...userPosts, postId])
    
    // Update user's post count
    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile) {
      userProfile.posts_count = (userProfile.posts_count || 0) + 1
      await kv.set(`user:${user.id}`, userProfile)
    }

    return c.json({ 
      message: 'Post created successfully',
      post: { id: postId, ...post }
    })
  } catch (error) {
    console.log('Post creation error:', error)
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

// Get all posts
app.get('/make-server-eb1a20a7/posts', async (c) => {
  try {
    const posts = await kv.getByPrefix('post:')
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    return c.json({ posts: sortedPosts })
  } catch (error) {
    console.log('Posts fetch error:', error)
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// Get single post
app.get('/make-server-eb1a20a7/posts/:id', async (c) => {
  try {
    const postId = c.req.param('id')
    const post = await kv.get(`post:${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    return c.json({ post })
  } catch (error) {
    console.log('Post fetch error:', error)
    return c.json({ error: 'Failed to fetch post' }, 500)
  }
})

// Get user's posts
app.get('/make-server-eb1a20a7/users/:userId/posts', async (c) => {
  try {
    const userId = c.req.param('userId')
    const userPostIds = await kv.get(`user_posts:${userId}`) || []
    
    const posts = await Promise.all(
      userPostIds.map(id => kv.get(`post:${id}`))
    )
    
    const validPosts = posts.filter(Boolean).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return c.json({ posts: validPosts })
  } catch (error) {
    console.log('User posts fetch error:', error)
    return c.json({ error: 'Failed to fetch user posts' }, 500)
  }
})

// Delete post (only by author)
app.delete('/make-server-eb1a20a7/posts/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const postId = c.req.param('id')
    const post = await kv.get(`post:${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    if (post.user_id !== user.id) {
      return c.json({ error: 'You can only delete your own posts' }, 403)
    }

    // Delete post
    await kv.del(`post:${postId}`)
    
    // Remove from user's posts list
    const userPostsKey = `user_posts:${user.id}`
    const userPosts = await kv.get(userPostsKey) || []
    await kv.set(userPostsKey, userPosts.filter(id => id !== postId))
    
    // Update user's post count
    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile) {
      userProfile.posts_count = Math.max((userProfile.posts_count || 1) - 1, 0)
      await kv.set(`user:${user.id}`, userProfile)
    }

    return c.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.log('Post deletion error:', error)
    return c.json({ error: 'Failed to delete post' }, 500)
  }
})

Deno.serve(app.fetch)