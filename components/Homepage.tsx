import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { themes } from './mockData'
import type { Page, Post } from '../App'

type HomepageProps = {
  onNavigate: (page: Page, postId?: string) => void
  posts: Post[]
  loading: boolean
}

export function Homepage({ onNavigate, posts, loading }: HomepageProps) {
  const featuredPosts = posts.slice(0, 3)
  const recentPosts = posts.slice(3, 7)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const PostCard = ({ post, featured = false }: { post: Post, featured?: boolean }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={() => onNavigate('post', post.id)}>
        {post.imageUrl && (
          <div className={`relative ${featured ? 'h-48' : 'h-32'}`}>
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
            <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
          </div>
          <CardTitle className={featured ? 'text-lg' : 'text-base'}>{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">by {post.author}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
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

  const PostSkeleton = ({ featured = false }: { featured?: boolean }) => (
    <Card className="overflow-hidden">
      <Skeleton className={`w-full ${featured ? 'h-48' : 'h-32'}`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
        <h1 className="text-3xl mb-4">Welcome to BlogHub</h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          A community-driven platform where creators share insights, stories, and expertise 
          across diverse themes and subjects.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => onNavigate('browse')}>
            Explore Content
          </Button>
          <Button variant="outline" onClick={() => onNavigate('submit')}>
            Share Your Story
          </Button>
        </div>
      </section>

      {/* Featured Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2>Featured Posts</h2>
          <Button variant="ghost" onClick={() => onNavigate('browse')}>
            View All →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} featured />
            ))
          ) : featuredPosts.length > 0 ? (
            featuredPosts.map(post => (
              <PostCard key={post.id} post={post} featured />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground mb-4">No posts available yet.</p>
              <Button onClick={() => onNavigate('submit')}>
                Be the first to submit content!
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Popular Themes */}
      <section>
        <h2 className="mb-6">Popular Themes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {themes.map(theme => (
            <Button
              key={theme}
              variant="outline"
              className="h-auto p-4 text-center justify-center"
              onClick={() => onNavigate('browse')}
            >
              {theme}
            </Button>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <h2 className="mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))
            ) : (
              recentPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>
      )}
    </div>
  )
}