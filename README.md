🏡 StayFinder – Airbnb-style MVP

StayFinder is a modern rental marketplace MVP inspired by Airbnb, built with Angular 20 and Supabase.

It allows users to browse properties, view details, and request bookings, while hosts can manage listings through a dedicated dashboard.

🚀 Tech Stack
Frontend: Angular 20 (Standalone + Signals)
Backend: Supabase (PostgreSQL, Auth, Storage, RLS)
Styling: SCSS (custom Airbnb-inspired UI)
State Management: Angular Signals + async/await

✨ Features (Implemented)
🏠 Property Discovery
Browse properties on the home page
Responsive grid and carousel UI
Search properties by city
Dynamic property detail pages

📄 Property Detail Page
Full property description
Image display
Host information
Availability calendar (next 30 days)
Booking request form

📅 Booking System
Users can request bookings with:
Name & email
Check-in / check-out dates
Automatic price calculation
Booking saved in Supabase
Dates are blocked after booking

🧑‍💼 Host Dashboard
Add new properties
Upload images via Supabase Storage
View all properties
View booking requests
Revenue potential calculation

🖼️ Image Upload
Upload property images
Stored in Supabase Storage
Public URL automatically generated

🎨 UI / UX
Airbnb-inspired design
Responsive layout (mobile + desktop)
Sticky navbar
Hero section + search bar
Carousel sections
Loading states and empty states
Modern typography (Inter font)
Footer with structured content

🗄️ Database
PostgreSQL (via Supabase)
Tables:
properties
bookings
property_availability
profiles
Row Level Security (RLS) enabled

⚠️ Current Limitations

This project is an MVP and some features are simplified:

Booking is not transactional (no rollback if one step fails)
Availability is managed client-side after booking
No advanced filtering (price, dates, guests)
No pagination
No map integration

🔐 Features In Progress / Planned
Authentication & Roles
 Supabase Auth fully integrated in UI
 Email confirmation flow
 Password reset

User Roles
 Clear separation between:
Guest (client)
Host (property owner)
 Role-based UI and permissions

Booking System Improvements
 Approval/rejection system for hosts
 Booking status updates
 Prevent double-booking with DB transaction (RPC)

Property Management
 Edit / delete property
 Multiple images per property
 Property availability editor (calendar for hosts)

Search & Filters
 Filter by:
Price range
Number of guests
Category
 Date-based availability search

UX Improvements
 Skeleton loaders
 Toast notifications
 Favorites (wishlist)
 Better mobile navigation

Payments
 Stripe integration
 Secure checkout flow

Key Learnings
    Building a full-stack app with Angular + Supabase
    Using Row Level Security (RLS) for data protection
    Managing UI state with Angular Signals
    Handling async flows and UX feedback
    Designing a scalable frontend architecture with models and services      

📌 Author

Built by Luis Andrade
Product Manager → Developer transition
Focused on building real-world SaaS and marketplace applications

💡 Final Note

This project is intentionally built as an MVP to demonstrate:

Product thinking
Full-stack integration
Scalable architecture
Real-world feature implementation



