import { eventHandler } from 'h3'
import type { Booking } from '../../../app/types/provider/booking'

export const bookings: Booking[] = [
  {
    id: 1,
    company: 'Northwind Labs',
    offering: 'Mindful Mondays — 8 Week Program',
    date: '2026-07-13',
    time: '09:00 AM',
    location: 'Online (Zoom)',
    contactName: 'Alice Johnson',
    price: 1200,
    participants: 45,
    status: 'confirmed'
  },
  {
    id: 2,
    company: 'Helio Finance',
    offering: 'Stress Resilience Workshop',
    date: '2026-07-22',
    time: '02:00 PM',
    location: 'On-site',
    contactName: 'Bob Smith',
    price: 500,
    participants: 30,
    status: 'confirmed'
  },
  {
    id: 3,
    company: 'Apex Digital',
    offering: 'HIIT Bootcamp',
    date: '2026-07-28',
    time: '07:00 AM',
    location: 'Provider Studio',
    contactName: 'Charlie Davis',
    price: 300,
    participants: 15,
    status: 'confirmed'
  },
  {
    id: 4,
    company: 'Blueridge Partners',
    offering: 'Corporate Mindfulness Seminar',
    date: '2026-08-05',
    time: '10:00 AM',
    location: 'On-site',
    contactName: 'Diana Prince',
    price: 2500,
    participants: 120,
    status: 'confirmed'
  },
  {
    id: 5,
    company: 'Solaris Group',
    offering: 'Morning Yoga Flow',
    date: '2026-06-18',
    time: '08:00 AM',
    location: 'Provider Studio',
    contactName: 'Ethan Hunt',
    price: 400,
    participants: 50,
    status: 'completed'
  },
  {
    id: 6,
    company: 'Crestline Media',
    offering: 'Strength Training 101',
    date: '2026-06-25',
    time: '05:30 PM',
    location: 'Provider Studio',
    contactName: 'Fiona Gallagher',
    price: 200,
    participants: 8,
    status: 'completed'
  },
  {
    id: 7,
    company: 'Veritas Capital',
    offering: 'Gut Health Fundamentals',
    date: '2026-07-30',
    time: '12:00 PM',
    location: 'Online (Zoom)',
    contactName: 'George Costanza',
    price: 800,
    participants: 60,
    status: 'confirmed'
  },
  {
    id: 8,
    company: 'Ironclad Systems',
    offering: 'Breathwork for Beginners',
    date: '2026-06-10',
    time: '04:00 PM',
    location: 'On-site',
    contactName: 'Hannah Abbott',
    price: 600,
    participants: 35,
    status: 'completed'
  },
  {
    id: 9,
    company: 'Luminary Co.',
    offering: 'Kettlebell Core Crush',
    date: '2026-07-03',
    time: '06:00 AM',
    location: 'Provider Studio',
    contactName: 'Ian Malcolm',
    price: 250,
    participants: 12,
    status: 'cancelled'
  },
  {
    id: 10,
    company: 'Zenith Consulting',
    offering: 'Sleep Hygiene Masterclass',
    date: '2026-08-12',
    time: '01:00 PM',
    location: 'Online (Zoom)',
    contactName: 'Julia Child',
    price: 1500,
    participants: 80,
    status: 'confirmed'
  },
  {
    id: 11,
    company: 'Nexus Innovations',
    offering: 'Team Building Workshop',
    date: '2026-08-20',
    time: '09:00 AM',
    location: 'On-site',
    contactName: 'Kevin Hart',
    price: 2000,
    participants: 25,
    status: 'pending_confirmation'
  }
]

export default eventHandler(() => bookings)
