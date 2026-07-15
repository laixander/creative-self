# CLAUDE.md — creativeSelf Wellness Platform

## Project Overview

**creativeSelf** is a wellness marketplace and engagement platform for companies, HR teams, wellness providers, and employees. The platform allows wellness providers to showcase their services, while company HR representatives can discover, book, and manage wellness offerings for their organization.

The application includes provider listings, wellness service offerings, company HR registration, booking management, availed services tracking, provider dashboards, monitoring screens, and a media/feed section for promotional content such as videos, podcasts, ads, and commercials.

## Primary Users

### 1. Company HR / Corporate Client
Company HR users represent organizations that want to avail wellness services for their employees.

Key capabilities:
- Register a company account
- Manage company profile
- Search wellness providers and offerings
- Browse offerings by category
- Book wellness services
- View availed services
- Track booking status
- Access dashboard and reports
- View promotional media and wellness content

### 2. Wellness Provider
Providers offer wellness-related services through the platform.

Key capabilities:
- Manage provider profile
- Create and update service offerings
- Define categories, schedules, pricing, packages, and availability
- Monitor bookings and client companies
- View dashboard and engagement statistics
- Upload promotional content where allowed

### 3. Platform Administrator
The administrator manages the overall platform, users, content, providers, offerings, bookings, and reporting.

Key capabilities:
- Approve or manage provider accounts
- Manage company HR accounts
- Manage categories and service types
- Moderate media/feed content
- Monitor bookings and availed services
- View platform-wide analytics

## Core Modules

## 1. Public Website / Landing Page

The public website should introduce creativeSelf as a wellness platform for companies and providers.

Suggested sections:
- Hero section
- Featured wellness providers
- Featured offerings
- Categories of wellness services
- Promotional videos and campaigns
- Podcasts or media highlights
- Call-to-action for company HR registration
- Call-to-action for provider onboarding
- Contact or inquiry section

## 2. Company HR Registration

Company HR users must be able to create an account and register their company.

Suggested fields:
- Company name
- Company address
- Industry
- Number of employees
- HR contact person
- Email address
- Mobile number
- Designation
- Username and password
- Company documents, if required

Registration flow:
1. HR fills out company registration form
2. System validates required fields
3. Account is created with pending or active status depending on business rules
4. HR receives confirmation
5. HR can log in to the company portal

## 3. Account Management

Account management should allow users to update profiles, credentials, roles, and access permissions.

Company HR account management:
- Company profile
- HR user profile
- Additional HR users or representatives
- Password change
- Notification preferences
- Booking history
- Availed services

Provider account management:
- Provider profile
- Contact information
- Service coverage areas
- Provider documents or credentials
- Team members or facilitators
- Service offerings
- Availability settings

Admin account management:
- User management
- Role management
- Account activation/deactivation
- Audit trail

## 4. Provider Directory

The provider directory displays wellness providers available in the platform.

Provider listing should include:
- Provider name
- Logo or profile photo
- Short description
- Wellness categories
- Featured offerings
- Location or service coverage
- Rating or feedback, if available
- View profile button

Provider profile should include:
- Full provider description
- Services offered
- Packages
- Availability
- Media content
- Contact or booking action
- Reviews or testimonials, if applicable

## 5. Offerings / Services Catalog

Offerings are the wellness services that company HR users can book.

Examples of offerings:
- Mental health talks
- Wellness workshops
- Fitness sessions
- Nutrition consultations
- Stress management programs
- Meditation sessions
- Art therapy
- Team building activities
- Corporate wellness packages
- Podcasts or recorded wellness content

Offering fields:
- Offering title
- Provider
- Category
- Description
- Service type: onsite, online, hybrid, recorded, live session
- Duration
- Price or package rate
- Maximum participants
- Available dates or schedule rules
- Requirements
- Deliverables
- Promotional image or video
- Status: draft, published, inactive

## 6. Search and Filtering

The portal must include search functions for both company HR users and administrators.

Search capabilities:
- Search offerings by keyword
- Search by category
- Search by provider
- Search by service type
- Search by price range
- Search by availability
- Search by location or coverage area
- Search companies by name
- Search company bookings
- Search availed services
- Search media/feed content

Important UX behavior:
- Search bar should be visible in provider and offerings pages
- Filters should be combinable
- Results should show clear empty states
- Sorting should support newest, most popular, category, provider, and availability

## 7. Booking Section

Company HR users must be able to book services offered by providers.

Booking flow:
1. HR searches or browses offerings
2. HR views offering details
3. HR selects preferred schedule, package, or service option
4. HR enters booking details
5. HR submits booking request
6. Provider reviews and confirms availability
7. Booking status updates are shown in the HR dashboard
8. Completed bookings are recorded as availed services

Booking details:
- Company
- HR contact person
- Provider
- Offering
- Preferred date and time
- Delivery mode: onsite, online, hybrid
- Number of participants
- Location or meeting link
- Special requirements
- Notes
- Booking status

Booking statuses:
- Draft
- Submitted
- Pending provider confirmation
- Confirmed
- Rescheduled
- Cancelled
- Completed
- Rejected

## 8. Availed Services

Availed services represent bookings that have been confirmed, completed, or consumed by the company.

Company HR should be able to view:
- List of availed services
- Provider name
- Offering title
- Date availed
- Participants
- Status
- Cost or package value
- Completion report
- Feedback form
- Certificates or attachments, if applicable

Provider should be able to view:
- Companies that availed their services
- Service history
- Upcoming engagements
- Completed engagements
- Feedback and ratings

## 9. Company HR Dashboard

The company dashboard should provide an overview of the company’s wellness activities.

Suggested dashboard widgets:
- Total bookings
- Upcoming sessions
- Completed sessions
- Pending booking requests
- Availed services
- Featured recommended offerings
- Recently viewed offerings
- Media/feed highlights
- Wellness spend summary, if applicable

Dashboard screens:
- Overview
- Bookings
- Availed services
- Recommended offerings
- Company profile
- Reports

## 10. Provider Dashboard

Providers should have their own dashboard and monitoring screens.

Suggested provider dashboard widgets:
- Total offerings
- Published offerings
- Pending booking requests
- Confirmed bookings
- Completed bookings
- Companies served
- Upcoming sessions
- Engagement or views count
- Revenue or package value, if applicable

Provider monitoring screens:
- Booking requests
- Confirmed schedules
- Completed services
- Company clients
- Offering performance
- Media performance
- Feedback and ratings

## 11. Media / Feed Section

The media/feed section is used for promotional and wellness-related content.

Supported content types:
- Promotional videos
- Podcast episodes
- Ads
- Commercials
- Wellness articles
- Provider campaigns
- Event announcements
- Featured service promotions

Feed content fields:
- Title
- Description
- Content type
- Media URL or uploaded file
- Thumbnail
- Provider or platform owner
- Category
- Tags
- Publish date
- Expiry date, if applicable
- Visibility: public, company-only, provider-only, admin-only
- Status: draft, published, archived

Feed behavior:
- Users can browse latest content
- Users can filter by content type and category
- Company HR can view promotional materials before booking
- Admin can moderate content
- Providers may submit promotional content subject to approval

## 12. Admin Portal

The admin portal manages the full system.

Admin modules:
- Dashboard
- Company management
- Provider management
- Offering management
- Booking management
- Availed services monitoring
- Category management
- Media/feed management
- User and role management
- Reports
- Audit logs

Admin dashboard widgets:
- Total companies
- Total providers
- Total offerings
- Active bookings
- Completed bookings
- Pending approvals
- Published media content
- Most searched categories

## Suggested Data Entities

Use these entities as a starting point. Adjust as needed based on the selected framework and database.

### User
- id
- name
- email
- password_hash
- role
- status
- created_at
- updated_at

### Company
- id
- name
- industry
- address
- employee_count
- contact_person
- contact_email
- contact_number
- status
- created_at
- updated_at

### Provider
- id
- name
- description
- logo_url
- contact_email
- contact_number
- address
- coverage_area
- status
- created_at
- updated_at

### Category
- id
- name
- description
- parent_category_id
- status

### Offering
- id
- provider_id
- category_id
- title
- description
- service_type
- duration
- price
- max_participants
- requirements
- deliverables
- thumbnail_url
- status
- created_at
- updated_at

### Booking
- id
- company_id
- provider_id
- offering_id
- requested_by_user_id
- preferred_start_datetime
- preferred_end_datetime
- confirmed_start_datetime
- confirmed_end_datetime
- delivery_mode
- participant_count
- location
- meeting_link
- special_requirements
- notes
- status
- created_at
- updated_at

### AvailedService
- id
- booking_id
- company_id
- provider_id
- offering_id
- availed_date
- participant_count
- completion_status
- completion_notes
- feedback_status
- created_at
- updated_at

### MediaPost
- id
- title
- description
- content_type
- media_url
- thumbnail_url
- provider_id
- category_id
- tags
- visibility
- status
- publish_date
- expiry_date
- created_at
- updated_at

### Feedback
- id
- booking_id
- company_id
- provider_id
- rating
- comments
- created_at

## Suggested Navigation

### Public Navigation
- Home
- Providers
- Offerings
- Media
- About
- Contact
- Register as Company HR
- Register as Provider
- Login

### Company HR Portal
- Dashboard
- Search Offerings
- Providers
- Bookings
- Availed Services
- Media / Feed
- Company Profile
- Account Settings

### Provider Portal
- Dashboard
- Offerings
- Booking Requests
- Schedule Monitoring
- Availed Services
- Company Clients
- Media Content
- Provider Profile
- Account Settings

### Admin Portal
- Dashboard
- Companies
- Providers
- Offerings
- Bookings
- Availed Services
- Media / Feed
- Categories
- Users
- Reports
- Audit Logs

## Recommended User Flows

### Company HR Booking Flow
1. HR logs in
2. HR searches offerings or categories
3. HR opens offering details
4. HR reviews provider profile and service information
5. HR clicks Book Service
6. HR selects date, delivery mode, and participants
7. HR submits request
8. Provider confirms or proposes changes
9. HR receives booking update
10. Service is completed
11. Booking becomes an availed service
12. HR submits feedback

### Provider Offering Flow
1. Provider logs in
2. Provider creates offering
3. Provider assigns category and service type
4. Provider uploads promotional media
5. Provider publishes offering
6. Offering becomes searchable in the portal
7. Provider receives booking requests
8. Provider confirms or rejects booking
9. Provider monitors completed services

### Media Publishing Flow
1. Admin or provider creates media post
2. User uploads video, podcast, ad, or promotional content
3. Content is saved as draft
4. Admin reviews content if approval is required
5. Content is published to the feed
6. Company HR users can view content
7. Content can be linked to offerings or providers

## UI / UX Guidelines

- Keep the design clean, calm, and wellness-oriented
- Use cards for providers, offerings, bookings, and media posts
- Make search and filtering easy to access
- Show clear statuses using badges
- Use dashboards with summary cards and tables
- Provide empty states for no bookings, no offerings, and no search results
- Prioritize mobile-responsive layouts
- Keep booking steps simple and guided
- Use clear labels for company HR, provider, and admin screens

## Technical Guidelines for Claude Code

When generating code for this project:

- Follow the existing project structure if one is already present
- Do not introduce unnecessary dependencies
- Use clear naming conventions
- Keep components reusable
- Separate public website, company portal, provider portal, and admin portal concerns
- Use role-based access control
- Validate all forms on both client and server side
- Use pagination for listings
- Use search and filters for offerings, providers, companies, bookings, and media posts
- Use status enums for bookings, offerings, providers, companies, and media posts
- Add audit logs for important admin actions
- Never hard-code sensitive credentials
- Keep API responses consistent
- Include loading, error, and empty states

## Suggested Status Enums

### User Status
- active
- inactive
- pending
- suspended

### Provider Status
- pending
- approved
- rejected
- inactive

### Company Status
- pending
- approved
- inactive

### Offering Status
- draft
- published
- inactive
- archived

### Booking Status
- draft
- submitted
- pending_confirmation
- confirmed
- rescheduled
- cancelled
- completed
- rejected

### Media Status
- draft
- pending_review
- published
- archived

## Security Requirements

- Use authentication for all portal access
- Implement role-based authorization
- Company HR users must only access their own company data
- Providers must only access their own provider data, offerings, and bookings
- Admins can access all records
- Validate uploaded media files
- Restrict file size and allowed file types
- Sanitize user-generated content
- Log critical actions
- Protect booking and company data from unauthorized access

## Reporting Requirements

### Company HR Reports
- Bookings by status
- Availed services summary
- Upcoming wellness sessions
- Completed services
- Provider engagement history

### Provider Reports
- Booking requests by status
- Services availed by companies
- Offering performance
- Upcoming schedules
- Feedback summary

### Admin Reports
- Company registrations
- Provider registrations
- Popular categories
- Most booked offerings
- Booking status summary
- Media engagement summary

## Future Enhancements

Potential future features:
- Employee self-service access
- Online payment integration
- Subscription packages for companies
- Provider ratings and reviews
- Wellness calendar
- Email and SMS notifications
- In-app chat between HR and providers
- AI-powered offering recommendations
- Corporate wellness analytics
- Certificates of participation
- Attendance tracking
- Integration with HRIS or payroll systems

## Development Priority

Recommended MVP priority:

1. Authentication and role-based access
2. Company HR registration
3. Provider profile management
4. Offering catalog
5. Search and filtering
6. Booking workflow
7. Company dashboard
8. Provider dashboard
9. Availed services tracking
10. Media/feed section
11. Admin management screens
12. Reports and monitoring

## Claude Code Behavior Rules

When working on this project, Claude should:

- Ask only when requirements are blocking
- Prefer practical implementation over over-engineering
- Keep the wellness marketplace concept consistent
- Maintain separate dashboards for company HR, providers, and admin
- Ensure search is available for offerings, categories, providers, companies, bookings, and media posts
- Treat bookings and availed services as separate but related concepts
- Make every major listing searchable and filterable
- Use reusable components for cards, tables, filters, modals, and forms
- Keep the UI professional and suitable for corporate wellness clients
