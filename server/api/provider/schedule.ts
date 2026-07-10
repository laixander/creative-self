import { eventHandler } from 'h3'
import type { ScheduleEvent } from '../../../app/types/provider/scheduleEvent'

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 1,
    title: 'Mindful Mondays — 8 Week Program',
    date: '2026-07-13',
    time: '09:00 AM',
    duration: '60 min',
    participants: 45,
    type: 'online',
    color: 'primary',
    organization: 'Northwind Labs',
    locationStr: 'Zoom',
    status: 'Confirmed'
  },
  {
    id: 2,
    title: 'Stress Resilience Workshop',
    date: '2026-07-22',
    time: '01:30 PM',
    duration: '90 min',
    participants: 30,
    type: 'in-person',
    color: 'success',
    organization: 'Helio Finance',
    locationStr: 'London office + Zoom',
    status: 'Confirmed'
  },
  {
    id: 3,
    title: 'HIIT Bootcamp',
    date: '2026-07-28',
    time: '06:00 PM',
    duration: '45 min',
    participants: 15,
    type: 'in-person',
    color: 'warning'
  },
  {
    id: 4,
    title: 'Corporate Mindfulness Seminar',
    date: '2026-08-05',
    time: '10:00 AM',
    duration: '120 min',
    participants: 120,
    type: 'hybrid',
    color: 'info'
  },
  {
    id: 5,
    title: 'Morning Yoga Flow',
    date: '2026-07-18',
    time: '07:00 AM',
    duration: '60 min',
    participants: 50,
    type: 'online',
    color: 'secondary'
  },
  {
    id: 6,
    title: 'Gut Health Fundamentals',
    date: '2026-07-30',
    time: '12:00 PM',
    duration: '60 min',
    participants: 60,
    type: 'online',
    color: 'error'
  },
  {
    id: 7,
    title: 'Breathwork for Beginners',
    date: '2026-07-10',
    time: '05:30 PM',
    duration: '45 min',
    participants: 35,
    type: 'in-person',
    color: 'primary'
  },
  {
    id: 8,
    title: 'Mindful Mondays — 8 Week Program',
    date: '2026-07-20',
    time: '09:00 AM',
    duration: '60 min',
    participants: 45,
    type: 'online',
    color: 'primary',
    organization: 'Northwind Labs',
    locationStr: 'Zoom',
    status: 'Confirmed'
  },
  {
    id: 9,
    title: 'Sleep Hygiene Masterclass',
    date: '2026-08-12',
    time: '11:00 AM',
    duration: '60 min',
    participants: 80,
    type: 'online',
    color: 'secondary',
    organization: 'Zenith Consulting',
    locationStr: 'Teams',
    status: 'Confirmed'
  },
  {
    id: 10,
    title: 'Kettlebell Core Crush',
    date: '2026-07-15',
    time: '06:30 PM',
    duration: '50 min',
    participants: 12,
    type: 'in-person',
    color: 'warning',
    status: 'Pending'
  }
]

export default eventHandler(() => scheduleEvents)
