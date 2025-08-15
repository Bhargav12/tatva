import type { Post } from '../App'

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'The Future of Web Development: React 19 and Beyond',
    author: 'Sarah Chen',
    content: `React 19 brings exciting new features that will revolutionize how we build web applications. The new concurrent features and improved server components make development more efficient than ever.

In this comprehensive guide, we'll explore the key features including:
- Concurrent rendering improvements
- Enhanced server components
- New hooks and APIs
- Performance optimizations

The React team has been working tirelessly to improve developer experience while maintaining backward compatibility. These changes represent a significant step forward in modern web development.`,
    excerpt: 'Exploring the revolutionary features coming in React 19 and how they will transform modern web development.',
    theme: 'Web Development',
    type: 'blog',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    date: '2024-01-15',
    tags: ['React', 'JavaScript', 'Frontend', 'Development']
  },
  {
    id: '2',
    title: 'Sustainable Cooking: Zero Waste Kitchen Tips',
    author: 'Marcus Green',
    content: `Learn how to transform your kitchen into a zero-waste environment with these practical tips and sustainable cooking methods.

From meal planning to composting, discover how small changes can make a big environmental impact while saving money on groceries.`,
    excerpt: 'Practical tips for creating a sustainable, zero-waste kitchen that benefits both the environment and your wallet.',
    theme: 'Sustainability',
    type: 'vlog',
    videoUrl: 'https://example.com/video/sustainable-cooking',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
    date: '2024-01-12',
    tags: ['Sustainability', 'Cooking', 'Environment', 'Zero Waste']
  },
  {
    id: '3',
    title: 'Building Resilient Mental Health in Remote Work',
    author: 'Dr. Emily Rodriguez',
    content: `Remote work has fundamentally changed how we approach work-life balance and mental health. This guide provides evidence-based strategies for maintaining psychological well-being while working from home.

Key topics covered:
- Creating boundaries between work and personal time
- Building social connections in virtual environments
- Managing isolation and maintaining motivation
- Developing healthy daily routines`,
    excerpt: 'Evidence-based strategies for maintaining mental health and well-being in remote work environments.',
    theme: 'Mental Health',
    type: 'blog',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    date: '2024-01-10',
    tags: ['Mental Health', 'Remote Work', 'Wellness', 'Psychology']
  },
  {
    id: '4',
    title: 'AI in Creative Industries: Opportunities and Challenges',
    author: 'Alex Thompson',
    content: `Artificial Intelligence is reshaping creative industries from graphic design to music production. This analysis explores both the opportunities and ethical considerations.`,
    excerpt: 'An in-depth look at how AI is transforming creative work and what it means for artists and designers.',
    theme: 'Technology',
    type: 'blog',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    date: '2024-01-08',
    tags: ['AI', 'Technology', 'Creative', 'Innovation']
  },
  {
    id: '5',
    title: 'Urban Gardening for Beginners',
    author: 'Lisa Park',
    content: `Transform your small urban space into a thriving garden with these beginner-friendly techniques and plant recommendations.`,
    excerpt: 'Step-by-step guide to starting your own urban garden, even in the smallest spaces.',
    theme: 'Lifestyle',
    type: 'vlog',
    videoUrl: 'https://example.com/video/urban-gardening',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
    date: '2024-01-05',
    tags: ['Gardening', 'Urban Living', 'Plants', 'Sustainability']
  }
]

export const themes = [
  'Web Development',
  'Sustainability', 
  'Mental Health',
  'Technology',
  'Lifestyle',
  'Business',
  'Education',
  'Health',
  'Travel',
  'Finance'
]