import { eventHandler } from 'h3'
import type { HrBooking } from '../../../app/types/hr/booking'

export const bookings: HrBooking[] = [
  {
    "id": 1,
    "offering": "Mindful Mondays — 8 Week Program",
    "date": "2026-07-13",
    "time": "09:00 AM",
    "location": "Online (Zoom)",
    "contactName": "Alice Johnson",
    "price": 1200,
    "participants": 45,
    "status": "confirmed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 2,
    "offering": "Stress Resilience Workshop",
    "date": "2026-07-22",
    "time": "02:00 PM",
    "location": "On-site",
    "contactName": "Bob Smith",
    "price": 500,
    "participants": 30,
    "status": "confirmed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 3,
    "offering": "HIIT Bootcamp",
    "date": "2026-07-28",
    "time": "07:00 AM",
    "location": "Provider Studio",
    "contactName": "Charlie Davis",
    "price": 300,
    "participants": 15,
    "status": "confirmed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 4,
    "offering": "Corporate Mindfulness Seminar",
    "date": "2026-08-05",
    "time": "10:00 AM",
    "location": "On-site",
    "contactName": "Diana Prince",
    "price": 2500,
    "participants": 120,
    "status": "confirmed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 5,
    "offering": "Morning Yoga Flow",
    "date": "2026-06-18",
    "time": "08:00 AM",
    "location": "Provider Studio",
    "contactName": "Ethan Hunt",
    "price": 400,
    "participants": 50,
    "status": "completed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 6,
    "offering": "Strength Training 101",
    "date": "2026-06-25",
    "time": "05:30 PM",
    "location": "Provider Studio",
    "contactName": "Fiona Gallagher",
    "price": 200,
    "participants": 8,
    "status": "completed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 7,
    "offering": "Gut Health Fundamentals",
    "date": "2026-07-30",
    "time": "12:00 PM",
    "location": "Online (Zoom)",
    "contactName": "George Costanza",
    "price": 800,
    "participants": 60,
    "status": "confirmed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 8,
    "offering": "Breathwork for Beginners",
    "date": "2026-06-10",
    "time": "04:00 PM",
    "location": "On-site",
    "contactName": "Hannah Abbott",
    "price": 600,
    "participants": 35,
    "status": "completed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 9,
    "offering": "Kettlebell Core Crush",
    "date": "2026-07-03",
    "time": "06:00 AM",
    "location": "Provider Studio",
    "contactName": "Ian Malcolm",
    "price": 250,
    "participants": 12,
    "status": "cancelled",
    "provider": "Mindful Spaces"
  },
  {
    "id": 10,
    "offering": "Sleep Hygiene Masterclass",
    "date": "2026-08-12",
    "time": "01:00 PM",
    "location": "Online (Zoom)",
    "contactName": "Julia Child",
    "price": 1500,
    "participants": 80,
    "status": "confirmed",
    "provider": "Mindful Spaces"
  },
  {
    "id": 11,
    "offering": "Team Building Workshop",
    "date": "2026-08-20",
    "time": "09:00 AM",
    "location": "On-site",
    "contactName": "Kevin Hart",
    "price": 2000,
    "participants": 25,
    "status": "pending_confirmation",
    "provider": "Mindful Spaces"
  }
]

export default eventHandler(() => bookings)
