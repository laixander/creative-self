import { eventHandler } from 'h3'
import type { Booking } from '../../../app/types/provider/booking'

export const bookings: Booking[] = [
  {
    id: 1,
    company: 'Northwind Labs',
    offering: 'Mindful Mondays — 8 Week Program',
    date: '2026-07-13',
    participants: 45,
    status: 'confirmed'
  },
  {
    id: 2,
    company: 'Helio Finance',
    offering: 'Stress Resilience Workshop',
    date: '2026-07-22',
    participants: 30,
    status: 'confirmed'
  },
  {
    id: 3,
    company: 'Apex Digital',
    offering: 'HIIT Bootcamp',
    date: '2026-07-28',
    participants: 15,
    status: 'confirmed'
  },
  {
    id: 4,
    company: 'Blueridge Partners',
    offering: 'Corporate Mindfulness Seminar',
    date: '2026-08-05',
    participants: 120,
    status: 'confirmed'
  },
  {
    id: 5,
    company: 'Solaris Group',
    offering: 'Morning Yoga Flow',
    date: '2026-06-18',
    participants: 50,
    status: 'completed'
  },
  {
    id: 6,
    company: 'Crestline Media',
    offering: 'Strength Training 101',
    date: '2026-06-25',
    participants: 8,
    status: 'completed'
  },
  {
    id: 7,
    company: 'Veritas Capital',
    offering: 'Gut Health Fundamentals',
    date: '2026-07-30',
    participants: 60,
    status: 'confirmed'
  },
  {
    id: 8,
    company: 'Ironclad Systems',
    offering: 'Breathwork for Beginners',
    date: '2026-06-10',
    participants: 35,
    status: 'completed'
  },
  {
    id: 9,
    company: 'Luminary Co.',
    offering: 'Kettlebell Core Crush',
    date: '2026-07-03',
    participants: 12,
    status: 'cancelled'
  },
  {
    id: 10,
    company: 'Zenith Consulting',
    offering: 'Sleep Hygiene Masterclass',
    date: '2026-08-12',
    participants: 80,
    status: 'confirmed'
  },
  {
    id: 11,
    company: 'Nexus Innovations',
    offering: 'Team Building Workshop',
    date: '2026-08-20',
    participants: 25,
    status: 'pending'
  }
]

export default eventHandler(() => bookings)
