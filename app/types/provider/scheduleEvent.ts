export interface ScheduleEvent {
  id: number
  title: string
  date: string // YYYY-MM-DD
  time: string
  duration: string
  participants: number
  type: 'online' | 'in-person' | 'hybrid'
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  organization?: string
  locationStr?: string
  status?: 'Confirmed' | 'Pending'
}
