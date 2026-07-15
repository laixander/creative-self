import { eventHandler } from 'h3'
import type { HrProvider } from '../../../app/types/hr/provider'

export const providers: HrProvider[] = [
  {
    "id": 1,
    "name": "Northwind Labs",
    "description": "Top tier wellness provider specializing in Technology services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 8,
    "location": "San Francisco, CA",
    "contactEmail": "schen@northwindlabs.com",
    "rating": 4.1,
    "totalBookings": 8,
    "status": "active",
    "joinedDate": "2025-02-10"
  },
  {
    "id": 2,
    "name": "Helio Finance",
    "description": "Top tier wellness provider specializing in Finance services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 8,
    "location": "New York, NY",
    "contactEmail": "mreid@heliofinance.com",
    "rating": 3.7,
    "totalBookings": 5,
    "status": "active",
    "joinedDate": "2025-04-18"
  },
  {
    "id": 3,
    "name": "Apex Digital",
    "description": "Top tier wellness provider specializing in Marketing services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 6,
    "location": "Austin, TX",
    "contactEmail": "jpark@apexdigital.io",
    "rating": 3.7,
    "totalBookings": 3,
    "status": "active",
    "joinedDate": "2025-06-01"
  },
  {
    "id": 4,
    "name": "Blueridge Partners",
    "description": "Top tier wellness provider specializing in Consulting services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 18,
    "location": "Chicago, IL",
    "contactEmail": "dosei@blueridge.com",
    "rating": 4.8,
    "totalBookings": 12,
    "status": "active",
    "joinedDate": "2024-11-15"
  },
  {
    "id": 5,
    "name": "Solaris Group",
    "description": "Top tier wellness provider specializing in Energy services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 18,
    "location": "Houston, TX",
    "contactEmail": "pmenon@solarisgroup.com",
    "rating": 4.9,
    "totalBookings": 4,
    "status": "inactive",
    "joinedDate": "2025-01-20"
  },
  {
    "id": 6,
    "name": "Crestline Media",
    "description": "Top tier wellness provider specializing in Media services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 19,
    "location": "Los Angeles, CA",
    "contactEmail": "tom@crestlinemedia.com",
    "rating": 4.9,
    "totalBookings": 2,
    "status": "inactive",
    "joinedDate": "2025-05-12"
  },
  {
    "id": 7,
    "name": "Veritas Capital",
    "description": "Top tier wellness provider specializing in Finance services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 20,
    "location": "Boston, MA",
    "contactEmail": "obrooks@veritascap.com",
    "rating": 4.7,
    "totalBookings": 6,
    "status": "active",
    "joinedDate": "2025-03-05"
  },
  {
    "id": 8,
    "name": "Ironclad Systems",
    "description": "Top tier wellness provider specializing in Engineering services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 6,
    "location": "Seattle, WA",
    "contactEmail": "bnakamura@ironclad.io",
    "rating": 4,
    "totalBookings": 3,
    "status": "inactive",
    "joinedDate": "2025-02-28"
  },
  {
    "id": 9,
    "name": "Luminary Co.",
    "description": "Top tier wellness provider specializing in Retail services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 8,
    "location": "Portland, OR",
    "contactEmail": "awilliams@luminaryco.com",
    "rating": 3.9,
    "totalBookings": 1,
    "status": "inactive",
    "joinedDate": "2026-06-15"
  },
  {
    "id": 10,
    "name": "Zenith Consulting",
    "description": "Top tier wellness provider specializing in Consulting services.",
    "categories": [
      "meditation",
      "fitness"
    ],
    "offeringsCount": 20,
    "location": "Denver, CO",
    "contactEmail": "rwalsh@zenithco.com",
    "rating": 3.5,
    "totalBookings": 9,
    "status": "active",
    "joinedDate": "2024-12-01"
  }
]

export default eventHandler(() => providers)
