export interface AvailedBooking {
  id: number
  company: string
  offering: string
  image?: string
  date: string
  participants: number
  price: number
  rating: number
  status: 'confirmed' | 'completed' | 'cancelled'
}
