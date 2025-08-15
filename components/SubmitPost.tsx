import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { themes } from './mockData'
import type { Page } from '../App'

type SubmitPostProps = {
  onNavigate: (page: Page) => void
  onPostCreated: () => void
}

export function SubmitPost({ onNavigate, onPostCreated }: SubmitPostProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    excerpt: '',
    theme: '',
    type: 'blog' as 'blog' | 'vlog',
    videoUrl: '',
    imageUrl: '',
    tags: [] as string[]
  })
  
  const [currentTag, setCurrentTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitted(true)
      onPostCreated()
      
      setTimeout(() => {
        onNavigate('home')
      }, 2000)
    } catch (error) {
      console.error('Post creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Alert>
          <AlertDescription className="text-center">
            ✅ Your post has been submitted! Thank you for contributing to BlogHub.
            You'll be redirected to the homepage shortly.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1>Submit Your Content</h1>
        <p className="text-muted-foreground mt-2">
          Share your knowledge, experience, or creative work with the community
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title">Title *</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your post title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="author">Author Name *</label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Content Type *</label>
                <Select value={formData.type} onValueChange={(value: 'blog' | 'vlog') => 
                  setFormData(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="vlog">Video Blog (Vlog)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label>Theme *</label>
                <Select value={formData.theme} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, theme: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt">Brief Description *</label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Write a brief description or excerpt (1-2 sentences)"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content">Content *</label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your full content here..."
                rows={8}
                required
              />
            </div>

            {formData.type === 'vlog' && (
              <div className="space-y-2">
                <label htmlFor="videoUrl">Video URL</label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  type="url"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="imageUrl">Cover Image URL</label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <label>Tags</label>
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" 
                        onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Post'}
              </Button>
              <Button type="button" variant="outline" onClick={() => onNavigate('home')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}