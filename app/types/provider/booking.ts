export interface Booking {
  id: number
  company: string
  offering: string
  date: string
  participants: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}
