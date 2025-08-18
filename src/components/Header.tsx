import { Button } from './ui/button'
import type { Page } from '../App'

type HeaderProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onNavigate('home')}
              className="text-xl font-medium text-primary hover:text-primary/80"
            >
              BlogHub
            </button>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              Community-driven content platform
            </span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'browse' ? 'default' : 'ghost'}
              onClick={() => onNavigate('browse')}
            >
              Browse
            </Button>
            <Button
              variant={currentPage === 'submit' ? 'default' : 'ghost'}
              onClick={() => onNavigate('submit')}
            >
              Submit Content
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}