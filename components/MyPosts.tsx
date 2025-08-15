import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useAuth } from './AuthContext'
import { apiCall } from '../utils/supabase/client'
import type { Page, Post } from '../App'

type MyPostsProps = {
  onNavigate: (page: Page, postId?: string) => void
}

export function MyPosts({ onNavigate }: MyPostsProps) {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchMyPosts()
    }
  }, [user])

  const fetchMyPosts = async () => {
    try {
      setLoading(true)
      const data = await apiCall('/my-posts')
      setPosts(data.posts)
    } catch (err: any) {
      setError(err.message || 'Error loading your posts')
      console.log('Error fetching user posts:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card>
          <CardContent className="py-12">
            <h2>Sign In Required</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              You need to be signed in to view your posts.
            </p>
            <Button onClick={() => onNavigate('home')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={() => onNavigate('post', post.id)}>
        {post.imageUrl && (
          <div className="relative h-32">
            <ImageWithFallback
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={post.type === 'blog' ? 'default' : 'secondary'}>
                {post.type === 'blog' ? 'Blog' : 'Vlog'}
              </Badge>
            </div>
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">{post.theme}</Badge>
            <div className="flex items-center gap-2">
              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                {post.status || 'published'}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
            </div>
          </div>
          <CardTitle className="text-base">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1>My Posts</h1>
          <p className="text-muted-foreground mt-2">Loading your posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1>My Posts</h1>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Error loading your posts: {error}</p>
              <Button onClick={fetchMyPosts}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>  
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your submitted content
          </p>
        </div>
        <Button onClick={() => onNavigate('submit')}>
          Create New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3>No posts yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              You haven't submitted any posts to BlogHub yet.
            </p>
            <Button onClick={() => onNavigate('submit')}>
              Submit Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
            <Button variant="ghost" onClick={fetchMyPosts}>
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}