export interface Booking {
  id: number
  company: string
  offering: string
  date: string
  time?: string
  location?: string
  contactName?: string
  price?: number
  participants: number
  status: 'submitted' | 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
}
