export interface Client {
  id: number
  company: string
  industry: string
  contactName: string
  contactEmail: string
  employees: number
  location: string
  status: 'active' | 'inactive' | 'prospect'
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  totalParticipants: number
  totalSpend: number
  lastBookingDate: string
  memberSince: string
}
