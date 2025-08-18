import { projectId, publicAnonKey } from './supabase/info'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-eb1a20a7`

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(response.status, errorData.error || 'Request failed')
  }

  return response.json()
}

// Auth API
export const authApi = {
  signup: async (email: string, password: string, name: string) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  },

  getProfile: async (accessToken: string) => {
    return apiCall('/auth/profile', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
  },
}

// Posts API
export const postsApi = {
  create: async (postData: any, accessToken: string) => {
    return apiCall('/posts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify(postData),
    })
  },

  getAll: async () => {
    return apiCall('/posts')
  },

  getById: async (id: string) => {
    return apiCall(`/posts/${id}`)
  },

  getByUser: async (userId: string) => {
    return apiCall(`/users/${userId}/posts`)
  },

  delete: async (id: string, accessToken: string) => {
    return apiCall(`/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
  },
}