import { eventHandler } from 'h3'
import type { HrCompanyProfile } from '../../../app/types/hr/companyProfile'

export const profile: HrCompanyProfile = {
  "id": 101,
  "companyName": "Acme Corp",
  "industry": "Technology",
  "employeeCount": 500,
  "address": "123 Tech Lane, Silicon Valley, CA",
  "contactName": "Jane HR",
  "contactEmail": "jane@acme.com",
  "contactPhone": "+1-555-0199",
  "joinedDate": "2025-01-10T10:00:00Z"
}

export default eventHandler(() => profile)
