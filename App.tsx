import { useState } from 'react'
import { Header } from './components/Header'
import { Homepage } from './components/Homepage'
import { SubmitPost } from './components/SubmitPost'
import { BrowsePosts } from './components/BrowsePosts'
import { PostDetail } from './components/PostDetail'
import { mockPosts } from './components/mockData'

export type Post = {
  id: string
  title: string
  author: string
  content: string
  excerpt: string
  theme: string
  type: 'blog' | 'vlog'
  videoUrl?: string
  imageUrl?: string
  date: string
  tags: string[]
}

export type Page = 'home' | 'submit' | 'browse' | 'post'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>(mockPosts)

  const navigateTo = (page: Page, postId?: string) => {
    setCurrentPage(page)
    setSelectedPostId(postId || null)
  }

  const refreshPosts = () => {
    setPosts(mockPosts)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentPage={currentPage} 
        onNavigate={navigateTo}
      />
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <Homepage 
            onNavigate={navigateTo} 
            posts={posts} 
            loading={false}
          />
        )}
        {currentPage === 'submit' && (
          <SubmitPost 
            onNavigate={navigateTo} 
            onPostCreated={refreshPosts}
          />
        )}
        {currentPage === 'browse' && (
          <BrowsePosts 
            onNavigate={navigateTo} 
            posts={posts}
            loading={false}
          />
        )}
        {currentPage === 'post' && selectedPostId && (
          <PostDetail 
            postId={selectedPostId} 
            onNavigate={navigateTo}
            posts={posts}
          />
        )}
      </main>
    </div>
  )
}