import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { themes } from './mockData'
import type { Page, Post } from '../App'

type BrowsePostsProps = {
  onNavigate: (page: Page, postId?: string) => void
  posts: Post[]
  loading: boolean
}

export function BrowsePosts({ onNavigate, posts, loading }: BrowsePostsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filteredAndSortedPosts = useMemo(() => {
    if (loading) return []
    
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesTheme = selectedTheme === 'all' || post.theme === selectedTheme
      const matchesType = selectedType === 'all' || post.type === selectedType

      return matchesSearch && matchesTheme && matchesType
    })

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          const aDate = a.created_at || a.date
          const bDate = b.created_at || b.date
          return new Date(bDate).getTime() - new Date(aDate).getTime()
        case 'oldest':
          const aDateOld = a.created_at || a.date
          const bDateOld = b.created_at || b.date
          return new Date(aDateOld).getTime() - new Date(bDateOld).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [posts, searchTerm, selectedTheme, selectedType, sortBy, loading])

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
          <div className="relative h-48">
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
            <span className="text-xs text-muted-foreground">
              {formatDate(post.created_at || post.date)}
            </span>
          </div>
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">by {post.author}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.excerpt}</p>
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  )

  const PostSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-48" />
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
    <div className="space-y-6">
      <div className="text-center">
        <h1>Browse Content</h1>
        <p className="text-muted-foreground mt-2">
          Discover blogs and vlogs from our community of creators
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="search">Search</label>
              <Input
                id="search"
                placeholder="Search posts, authors, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label>Theme</label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  {themes.map(theme => (
                    <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label>Content Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="blog">Blog Posts</SelectItem>
                  <SelectItem value="vlog">Video Blogs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label>Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm || selectedTheme !== 'all' || selectedType !== 'all') && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer"
                       onClick={() => setSearchTerm('')}>
                  Search: "{searchTerm}" ×
                </Badge>
              )}
              {selectedTheme !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer"
                       onClick={() => setSelectedTheme('all')}>
                  Theme: {selectedTheme} ×
                </Badge>
              )}
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer"
                       onClick={() => setSelectedType('all')}>
                  Type: {selectedType} ×
                </Badge>
              )}
              <Button variant="ghost" size="sm" 
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedTheme('all')
                        setSelectedType('all')
                      }}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {loading 
            ? 'Loading posts...' 
            : `${filteredAndSortedPosts.length} post${filteredAndSortedPosts.length !== 1 ? 's' : ''} found`
          }
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      ) : filteredAndSortedPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {posts.length === 0 
                ? 'No posts have been submitted yet.' 
                : 'No posts match your current filters.'
              }
            </p>
            {posts.length === 0 ? (
              <Button onClick={() => onNavigate('submit')}>
                Submit the First Post
              </Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setSelectedTheme('all')
                setSelectedType('all')
              }}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}