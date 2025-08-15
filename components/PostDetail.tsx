import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'
import type { Page, Post } from '../App'

type PostDetailProps = {
  postId: string
  onNavigate: (page: Page) => void
  posts: Post[]
}

export function PostDetail({ postId, onNavigate, posts }: PostDetailProps) {
  const post = posts.find(p => p.id === postId)

  if (!post) {
    return (
      <div className="text-center py-12">
        <Card>
          <CardContent className="py-12">
            <h2>Post Not Found</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              The post you're looking for doesn't exist.
            </p>
            <Button onClick={() => onNavigate('browse')}>
              Back to Browse
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
      month: 'long', 
      day: 'numeric' 
    })
  }

  const relatedPosts = posts
    .filter(p => p.id !== post.id && p.theme === post.theme)
    .slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => onNavigate('browse')}>
        ← Back to Browse
      </Button>

      {/* Post Header */}
      <Card>
        <CardContent className="p-0">
          {post.imageUrl && (
            <div className="relative h-64 md:h-80">
              <ImageWithFallback
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge variant={post.type === 'blog' ? 'default' : 'secondary'} className="text-sm">
                  {post.type === 'blog' ? 'Blog Post' : 'Video Blog'}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{post.theme}</Badge>
              <span className="text-sm text-muted-foreground">
                Published on {formatDate(post.created_at || post.date)}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl mb-2">{post.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">by {post.author}</p>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Section (for vlogs) */}
      {post.type === 'vlog' && post.videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Video Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Video content would be embedded here
              </p>
              <Button variant="outline" asChild>
                <a href={post.videoUrl} target="_blank" rel="noopener noreferrer">
                  Watch Video →
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>More from {post.theme}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map(relatedPost => (
                <div
                  key={relatedPost.id}
                  className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => onNavigate('post', relatedPost.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{relatedPost.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(relatedPost.created_at || relatedPost.date)}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-1">{relatedPost.title}</h4>
                  <p className="text-xs text-muted-foreground">by {relatedPost.author}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pb-8">
        <Button onClick={() => onNavigate('browse')}>
          Browse More Posts
        </Button>
        <Button variant="outline" onClick={() => onNavigate('submit')}>
          Submit Your Own
        </Button>
      </div>
    </div>
  )
}