export interface HrProvider {
  id: number
  name: string
  logo?: string
  description: string
  categories: string[]
  offeringsCount: number
  location: string
  contactEmail: string
  rating: number
  totalBookings: number
  status: 'active' | 'inactive'
  joinedDate: string
}
