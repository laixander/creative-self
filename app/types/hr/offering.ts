export interface HrOffering {
  id: number
  providerId: number
  providerName: string
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
