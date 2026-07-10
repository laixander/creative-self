export interface MediaPost {
  id: number
  title: string
  type: 'video' | 'podcast' | 'article'
  description: string
  thumbnail?: string
  url?: string
  publishedDate: string
  views: number
  likes: number
  comments: number
  duration?: string  // for video/podcast
  readTime?: string  // for article
  status: 'published' | 'draft' | 'archived'
  tags: string[]
}
