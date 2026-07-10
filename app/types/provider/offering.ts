export interface Offering {
  id: number
  title: string
  description?: string
  image?: string
  category: 'fitness' | 'meditation' | 'nutrition' | 'stress-management'
  type: 'online' | 'hybrid' | 'in-person'
  duration: string
  price: number
  maxParticipants: number
  status: 'published' | 'draft' | 'archived'
}
