import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useAuth } from './AuthContext'
import type { Page } from '../App'

type UserProfileProps = {
  onNavigate: (page: Page) => void
  onPostsChange: () => void
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card>
          <CardContent className="py-12">
            <h2>Sign In Required</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              You need to be signed in to view your profile.
            </p>
            <Button onClick={() => onNavigate('home')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1>User Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <p className="text-base">{user.name}</p>
          </div>

          <div>
            <label className="text-sm">Email</label>
            <p className="text-base">{user.email}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onNavigate('browse')}>
              Browse Posts
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}