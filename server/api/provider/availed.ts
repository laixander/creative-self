import { eventHandler } from 'h3'
import type { AvailedBooking } from '../../../app/types/provider/availedBooking'

export const availedBookings: AvailedBooking[] = [
  {
    id: 1,
    company: 'Northwind Labs',
    offering: 'Mindful Mondays — 8 Week Program',
    image: '/img/stockphoto_2.jpg',
    date: '2026-07-13',
    participants: 45,
    price: 2400,
    rating: 4.2,
    status: 'confirmed'
  },
  {
    id: 2,
    company: 'Helio Finance',
    offering: 'Stress Resilience Workshop',
    image: '/img/stockphoto_3.jpg',
    date: '2026-07-22',
    participants: 30,
    price: 1800,
    rating: 4.1,
    status: 'confirmed'
  },
  {
    id: 3,
    company: 'Apex Digital',
    offering: 'HIIT Bootcamp',
    image: '/img/stockphoto_4.jpg',
    date: '2026-07-28',
    participants: 15,
    price: 1500,
    rating: 4.5,
    status: 'confirmed'
  },
  {
    id: 4,
    company: 'Blueridge Partners',
    offering: 'Corporate Mindfulness Seminar',
    image: '/img/stockphoto_11.jpg',
    date: '2026-08-05',
    participants: 120,
    price: 15000,
    rating: 4.8,
    status: 'confirmed'
  },
  {
    id: 5,
    company: 'Solaris Group',
    offering: 'Morning Yoga Flow',
    image: '/img/stockphoto_5.jpg',
    date: '2026-06-18',
    participants: 50,
    price: 3000,
    rating: 4.6,
    status: 'completed'
  },
  {
    id: 6,
    company: 'Crestline Media',
    offering: 'Strength Training 101',
    image: '/img/stockphoto_9.jpg',
    date: '2026-06-25',
    participants: 8,
    price: 1200,
    rating: 4.0,
    status: 'completed'
  },
  {
    id: 7,
    company: 'Veritas Capital',
    offering: 'Gut Health Fundamentals',
    image: '/img/stockphoto_18.jpg',
    date: '2026-07-30',
    participants: 60,
    price: 4800,
    rating: 4.3,
    status: 'confirmed'
  },
  {
    id: 8,
    company: 'Ironclad Systems',
    offering: 'Breathwork for Beginners',
    image: '/img/stockphoto_15.jpg',
    date: '2026-06-10',
    participants: 35,
    price: 2000,
    rating: 4.7,
    status: 'completed'
  },
  {
    id: 9,
    company: 'Luminary Co.',
    offering: 'Kettlebell Core Crush',
    image: '/img/stockphoto_17.jpg',
    date: '2026-07-03',
    participants: 12,
    price: 0,
    rating: 0,
    status: 'cancelled'
  },
  {
    id: 10,
    company: 'Zenith Consulting',
    offering: 'Sleep Hygiene Masterclass',
    image: '/img/stockphoto_7.jpg',
    date: '2026-08-12',
    participants: 80,
    price: 6400,
    rating: 4.9,
    status: 'confirmed'
  }
]

export default eventHandler(() => availedBookings)
