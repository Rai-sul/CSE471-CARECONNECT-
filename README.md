<div align="center">

# 🍼 CareConnect

### A Comprehensive Childcare & Babysitting Management Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**CareConnect** bridges the gap between parents seeking reliable childcare and professional babysitters — providing AI-powered matching, real-time GPS tracking, secure payments, video conferencing, and a complete admin management panel.

[Getting Started](#-getting-started) · [Features](#-features) · [API Reference](#-api-reference) · [Architecture](#-architecture)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [User Roles & Permissions](#-user-roles--permissions)
- [Testing the Application](#-testing-the-application)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👨‍👩‍👧 For Parents

| Feature | Description |
|---------|-------------|
| **Smart Sitter Matching** | AI-powered algorithm matches parents with ideal babysitters based on location, availability, budget, child personality, experience, and ratings |
| **Child Profile Management** | Manage multiple children with details like age, stubbornness level, special needs, and interests |
| **Real-Time GPS Tracking** | Monitor babysitter location during active sessions with geofence violation alerts |
| **Booking System** | Book babysitters by selecting date, time, and duration with automatic cost calculation |
| **Secure Payments** | Pay via Stripe with full transaction history and payment receipts |
| **Video Conferencing** | Join video calls with babysitters via Stream Video SDK integration |
| **In-App Messaging** | Real-time chat with babysitters with translation support |
| **Daily Activity Reports** | Receive detailed reports about your child's day — meals, naps, activities, mood |
| **Reviews & Ratings** | Rate babysitters on punctuality, professionalism, and communication |
| **SOS Emergency Alerts** | Trigger emergency alerts with GPS coordinates in critical situations |

### 👶 For Babysitters

| Feature | Description |
|---------|-------------|
| **Profile & Certifications** | Showcase experience, upload certifications, and set hourly rates |
| **Availability Management** | Set weekly availability schedule with specific time slots per day |
| **Booking Management** | Accept, reject, or manage incoming booking requests |
| **Live Session Tracking** | Start sessions with GPS tracking, log activities in real-time |
| **Activity Logging** | Log meals, naps, playtime, and upload photos as evidence |
| **Earnings & Payments** | Track payment history and earnings from completed bookings |

### 🛡️ For Administrators

| Feature | Description |
|---------|-------------|
| **Dashboard Analytics** | View total users, pending approvals, active bookings, and revenue stats |
| **User Approval System** | Review and approve/reject babysitter registrations with email notifications |
| **User Management** | View, ban, unban, or delete users across the platform |
| **Booking Oversight** | Monitor all bookings system-wide and update statuses |
| **SOS Alert Monitoring** | Receive and resolve emergency alerts in real-time |

### 🤖 AI & Automation

| Feature | Description |
|---------|-------------|
| **AI Chatbot** | OpenAI-powered chatbot with rule-based fallback for user support |
| **Smart Matching Engine** | 7-factor matching algorithm (location, availability, budget, personality, experience, rating, schedule) |
| **Email Notifications** | Automated emails for registration, approval, rejection, booking requests, payment confirmations, and meeting links |

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express 5** | REST API server |
| **Prisma ORM** | Database modeling & queries |
| **MongoDB** | NoSQL database |
| **JSON Web Tokens** | Authentication & authorization |
| **bcrypt** | Password hashing |
| **Stripe** | Payment processing |
| **Nodemailer** | Email notifications (SMTP) |
| **OpenAI API** | AI chatbot |
| **Stream Video SDK** | Video conferencing |
| **Multer** | File uploads |
| **Helmet + CORS** | Security headers & cross-origin |
| **express-validator** | Input validation |

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Radix UI** | Accessible UI primitives |
| **Shadcn/ui** | Pre-built component library |
| **Axios** | HTTP client with interceptors |
| **Socket.io Client** | Real-time messaging |
| **Recharts** | Dashboard charts & analytics |
| **React Hook Form** | Form state management |
| **React Hot Toast** | Toast notifications |
| **Lucide React** | Icon library |
| **date-fns** | Date utilities |

---

## 🏗 Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌──────────────┐
│   Next.js Frontend  │────▶│  Express.js Backend  │────▶│   MongoDB    │
│   (Port 3000)       │◀────│  (Port 5000)         │◀────│  (Port 27017)│
│                     │     │                      │     └──────────────┘
│  • React 19         │     │  • REST API (76 eps) │
│  • TypeScript       │     │  • Prisma ORM        │     ┌──────────────┐
│  • Tailwind CSS     │     │  • JWT Auth          │────▶│   Stripe     │
│  • Radix UI         │     │  • WebSocket         │     └──────────────┘
│  • Socket.io        │     │  • File Uploads      │
└─────────────────────┘     │                      │     ┌──────────────┐
                            │                      │────▶│   OpenAI     │
                            │                      │     └──────────────┘
                            │                      │
                            │                      │     ┌──────────────┐
                            │                      │────▶│  Stream.io   │
                            │                      │     └──────────────┘
                            │                      │
                            │                      │     ┌──────────────┐
                            │                      │────▶│  SMTP Email  │
                            └──────────────────────┘     └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **MongoDB** ≥ 6.x — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **npm** ≥ 9.x (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/careconnect.git
   cd careconnect
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   ```

### Environment Variables

#### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# Database (MongoDB)
DATABASE_URL="mongodb://localhost:27017/careconnect"

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d

# CORS / Frontend URL
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Email (SMTP) — For Gmail, use App Password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# OpenAI (Chatbot) — Optional
OPENAI_API_KEY=your_openai_api_key_here

# Stream Video SDK (Video Conferencing) — Optional
STREAM_API_KEY=your_stream_api_key_here
STREAM_SECRET_KEY=your_stream_secret_key_here
```

#### Frontend (`frontend/.env.local`)

Create a `.env.local` file in the `frontend/` directory:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe (Publishable Key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

> **📧 Gmail SMTP Setup:** Enable 2FA on your Google account, then generate an App Password at [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). Use the 16-character App Password as `SMTP_PASS`.

### Database Setup

1. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

2. **Push schema to MongoDB & seed data**

   ```bash
   cd backend
   npm run db:push
   ```

   This will:
   - Create all collections in MongoDB based on the Prisma schema
   - Seed the database with initial data (5 admins, 8 parents, 10 babysitters)

3. **Verify with Prisma Studio** (optional)

   ```bash
   npm run prisma:studio
   ```

   Opens a visual database browser at `http://localhost:5555`.

---

## ▶️ Running the Application

### Development Mode

Open **two terminal windows**:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

> Server starts at `http://localhost:5000`

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

> Frontend starts at `http://localhost:3000`

### Production Mode

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

---

## 📁 Project Structure

```
careconnect/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # MongoDB database schema (20 models)
│   │   └── seed.js                # Database seeding script
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Prisma client instance
│   │   ├── controllers/           # 17 route controllers
│   │   │   ├── activityController.js
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── chatbotController.js
│   │   │   ├── childController.js
│   │   │   ├── matchingController.js
│   │   │   ├── messagingController.js
│   │   │   ├── paymentController.js
│   │   │   ├── reviewController.js
│   │   │   ├── sessionController.js
│   │   │   ├── sitterController.js
│   │   │   ├── sosController.js
│   │   │   ├── stripeController.js
│   │   │   ├── uploadController.js
│   │   │   ├── userController.js
│   │   │   └── videoController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT, role guards, approval check
│   │   │   ├── errorMiddleware.js  # Global error handler
│   │   │   └── validationMiddleware.js
│   │   ├── routes/                 # 17 route modules
│   │   ├── services/
│   │   │   └── emailService.js     # Email notification templates
│   │   └── app.js                  # Express app configuration
│   ├── server.js                   # Server entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/admin/      # Admin panel pages
│   │   │   │   ├── page.tsx        # Admin dashboard
│   │   │   │   ├── approvals/      # Sitter approval management
│   │   │   │   ├── users/          # User management
│   │   │   │   ├── bookings/       # Booking oversight
│   │   │   │   └── settings/       # Admin settings
│   │   │   ├── (home)/             # Main app pages
│   │   │   │   ├── page.tsx        # Homepage
│   │   │   │   ├── (auth)/         # Login & Signup
│   │   │   │   ├── account/        # User dashboard (15 sub-pages)
│   │   │   │   │   ├── ai-matching/
│   │   │   │   │   ├── availability/
│   │   │   │   │   ├── bookings/
│   │   │   │   │   ├── certifications/
│   │   │   │   │   ├── chatbot/
│   │   │   │   │   ├── children/
│   │   │   │   │   ├── find-sitter/
│   │   │   │   │   ├── messages/
│   │   │   │   │   ├── payments/
│   │   │   │   │   ├── profile/
│   │   │   │   │   ├── reviews/
│   │   │   │   │   ├── sessions/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── video-call/
│   │   │   │   └── sitter/[id]/    # Dynamic sitter profile
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                 # Shadcn/ui components (14 files)
│   │   │   ├── chatbot/            # Floating chatbot widget
│   │   │   ├── messaging/          # Chat window component
│   │   │   ├── payment/            # Stripe payment modal
│   │   │   └── star-rating.tsx     # Star rating component
│   │   ├── modules/
│   │   │   ├── home/components/    # Navbar, Footer, Hero, UserNav
│   │   │   ├── admin/              # Admin sidebar & header
│   │   │   └── account/            # Account sidebar
│   │   ├── hooks/
│   │   │   └── use-auth.ts         # Authentication state hook
│   │   └── lib/
│   │       ├── proxy.ts            # Axios instance with JWT interceptor
│   │       └── utils.ts            # Tailwind cn() utility
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.local
│
├── CareConnect db.sql              # Original SQL schema reference
├── SETUP_INSTRUCTIONS.md
└── README.md
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register a new user (parent/babysitter) |
| `POST` | `/auth/login` | ❌ | Login and receive JWT token |

### User Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user/profile` | 🔒 | Get current user profile |
| `PUT` | `/user/update-profile` | 🔒 | Update profile (name, phone, location) |

### Children

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/children` | 🔒 | Add a child profile |
| `GET` | `/children` | 🔒 | List all children |
| `PUT` | `/children/:id` | 🔒 | Update child details |
| `DELETE` | `/children/:id` | 🔒 | Remove a child |

### Babysitters

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/sitters` | ❌ | Browse all approved babysitters |
| `GET` | `/sitters/:id` | ❌ | View babysitter profile with reviews |
| `GET` | `/sitters/me` | 🔒 | Get own sitter profile |
| `POST` | `/sitters/availability` | 🔒 | Set availability schedule |
| `GET` | `/sitters/availability` | 🔒 | Get current availability |

### AI Matching

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/matching/sitters` | 🔒 | Get AI-matched babysitters |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/bookings` | 🔒 | Create a booking request |
| `GET` | `/bookings` | 🔒 | Get my bookings (role-based) |
| `PATCH` | `/bookings/:id` | 🔒 | Update booking status (confirm/reject/cancel) |

### Live Sessions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/sessions/start` | 🔒 | Start live session with GPS |
| `POST` | `/sessions/location` | 🔒 | Update GPS coordinates |
| `POST` | `/sessions/end` | 🔒 | End session |
| `GET` | `/sessions/live` | 🔒 | Get active sessions |
| `GET` | `/sessions/:bookingId` | 🔒 | Get session details |

### Messaging

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/messaging/conversation` | 🔒 | Get or create conversation |
| `POST` | `/messaging/send` | 🔒 | Send a message |
| `GET` | `/messaging/conversations` | 🔒 | List all conversations |
| `PUT` | `/messaging/conversation/:id/read` | 🔒 | Mark messages as read |
| `POST` | `/messaging/translate` | 🔒 | Translate a message |
| `GET` | `/messaging/conversation/:id/history` | 🔒 | Get paginated message history |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/reviews` | 🔒 | Create a review |
| `GET` | `/reviews/my` | 🔒 | Reviews given by me |
| `GET` | `/reviews/received` | 🔒 | Reviews received |
| `GET` | `/reviews/sitter/:id` | ❌ | Public sitter reviews |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/payments` | 🔒 | Create payment record |
| `PUT` | `/payments/:id/confirm` | 🔒 | Confirm payment |
| `GET` | `/payments` | 🔒 | Get payment history |
| `GET` | `/payments/:id` | 🔒 | Get payment details |

### Stripe Integration

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/stripe/create-intent` | 🔒 | Create Stripe payment intent |
| `POST` | `/stripe/verify` | 🔒 | Verify payment status |
| `POST` | `/stripe/webhook` | ❌ | Stripe webhook handler |

### Video Conferencing

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/video/meeting` | 🔒 | Create meeting link |
| `GET` | `/video/meeting/:bookingId` | 🔒 | Get meeting link |
| `POST` | `/video/token` | 🔒 | Get Stream Video SDK token |

### AI Chatbot

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/chatbot/conversation` | 🔒 | Start chatbot conversation |
| `POST` | `/chatbot/chat` | 🔒 | Send message to chatbot |

### SOS Emergency

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/sos` | 🔒 | Create SOS alert |
| `GET` | `/sos` | 🔒 | Get active alerts |
| `GET` | `/sos/:id` | 🔒 | Get alert details |
| `PUT` | `/sos/:alertId/resolve` | 🔒 | Resolve alert |

### Activity Reports

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/activities/report` | 🔒 | Create/update daily report |
| `POST` | `/activities/log` | 🔒 | Add activity log entry |
| `GET` | `/activities/report/:bookingId` | 🔒 | Get daily report |
| `GET` | `/activities/:bookingId` | 🔒 | Get activity logs |
| `DELETE` | `/activities/log/:activityId` | 🔒 | Delete activity log |

### File Uploads

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload/profile` | 🔒 | Upload profile picture |
| `POST` | `/upload/document` | 🔒 | Upload certification document |
| `POST` | `/upload/activity` | 🔒 | Upload activity photo |

### Admin Panel

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/stats` | 🔒👑 | Dashboard statistics |
| `GET` | `/admin/approvals` | 🔒👑 | Pending babysitter approvals |
| `PUT` | `/admin/approve/:id` | 🔒👑 | Approve babysitter |
| `PUT` | `/admin/reject/:id` | 🔒👑 | Reject babysitter |
| `GET` | `/admin/users` | 🔒👑 | List all users |
| `PATCH` | `/admin/users/:id` | 🔒👑 | Ban/unban/delete user |
| `GET` | `/admin/users/:id` | 🔒👑 | Get user details |
| `GET` | `/admin/bookings` | 🔒👑 | List all bookings |
| `PATCH` | `/admin/bookings/:id/status` | 🔒👑 | Update booking status |

> **Legend:** ❌ = Public | 🔒 = JWT Required | 👑 = Admin Only

---

## 🗄 Database Schema

The application uses **MongoDB** with **Prisma ORM**. The schema consists of **20 models**:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│     User     │───▶│    Parent    │───▶│      Child       │
│              │    │              │    └──────────────────┘
│  • email     │    │  • location  │
│  • password  │    │  • budget    │    ┌──────────────────┐
│  • role      │    │  • situation │───▶│     Booking      │
│  • isApproved│    └──────────────┘    │                  │
│  • isBanned  │                        │  • startTime     │
│              │    ┌──────────────┐    │  • endTime       │
│              │───▶│  Babysitter  │───▶│  • status        │
│              │    │              │    │  • meetingLink   │
│              │    │  • hourlyRate│    │  • totalAmount   │
│              │    │  • location  │    └────────┬─────────┘
│              │    │  • rating    │             │
│              │    └──────┬───────┘    ┌────────┼──────────┐
│              │           │           ▼        ▼          ▼
│              │    ┌──────┴───────┐  Payment  Review  LiveSession
│              │    │Certification │
│              │    │Availability  │  ┌──────────────────┐
│              │    └──────────────┘  │  Conversation    │
│              │                      │    └─ Message    │
│              │───▶ SOSAlert         └──────────────────┘
│              │───▶ AdminLog
└──────────────┘    ┌──────────────────┐
                    │  DailyReport     │
                    │    └─ ActivityLog │
                    └──────────────────┘
```

### Models Overview

| Model | Description | Key Fields |
|-------|-------------|------------|
| `User` | Core user account | email, password (bcrypt), role, isApproved, isBanned |
| `Parent` | Parent profile | location (GPS), budget range, required days, situation |
| `Child` | Child information | name, age, stubbornness level (1-5), special needs, interests |
| `Babysitter` | Sitter profile | bio, experience years, hourly rate, GPS, average rating, badges |
| `Certification` | Sitter certifications | title, document URL, issuer, issue date |
| `Availability` | Weekly schedule | day of week, start/end time, is available |
| `Booking` | Booking request | parent/sitter IDs, schedule, status, meeting link, GPS logs |
| `LiveSession` | Active session tracking | GPS coordinates, geofence radius, violations, distance |
| `Conversation` | Chat thread | linked to booking (optional) |
| `Message` | Chat message | content, sender, read status, type (USER/BOT) |
| `Review` | Post-booking review | rating (1-5), punctuality, professionalism, communication |
| `Payment` | Payment record | transaction ID, amount, currency (BDT), status, method |
| `DailyReport` | Daily activity summary | notes, mood rating (1-5) |
| `ActivityLog` | Individual activity | type (Meal/Nap/Play), description, photo URL |
| `SOSAlert` | Emergency alert | GPS coordinates, status (ACTIVE/RESOLVED) |
| `AdminLog` | Admin audit trail | admin ID, action description, timestamp |
| `EmergencyContact` | Emergency contacts | name, phone, relationship, is primary |
| `ClassLink` | Sitter class links | sitter ID, link URL, info |
| `ConsultationSlot` | Consultation scheduling | parent/sitter, date, time, status |
| `SitterRecord` | Sitter video records | sitter ID, name, link |

---

## 👥 User Roles & Permissions

| Feature | Parent | Babysitter | Admin |
|---------|:------:|:----------:|:-----:|
| Register / Login | ✅ | ✅ | ✅ |
| Update Profile | ✅ | ✅ | ✅ |
| Manage Children | ✅ | ❌ | ❌ |
| Find & Book Sitters | ✅ | ❌ | ❌ |
| AI Sitter Matching | ✅ | ❌ | ❌ |
| Set Availability | ❌ | ✅ | ❌ |
| Accept/Reject Bookings | ❌ | ✅ | ✅ |
| Start Live Session | ❌ | ✅ | ❌ |
| Track GPS (View) | ✅ | ❌ | ❌ |
| Make Payments | ✅ | ❌ | ✅ |
| Write Reviews | ✅ | ✅ | ❌ |
| Send Messages | ✅ | ✅ | ❌ |
| Video Call | ✅ | ✅ | ❌ |
| Use Chatbot | ✅ | ✅ | ✅ |
| Trigger SOS | ✅ | ✅ | ❌ |
| Upload Certifications | ❌ | ✅ | ❌ |
| Log Activities | ❌ | ✅ | ❌ |
| Approve/Reject Sitters | ❌ | ❌ | ✅ |
| Ban/Unban Users | ❌ | ❌ | ✅ |
| View All Bookings | ❌ | ❌ | ✅ |
| Dashboard Analytics | ❌ | ❌ | ✅ |

---

## 🧪 Testing the Application

### Seed Accounts

After running `npm run db:push`, the following test accounts are available:

**Admin:**
| Name | Email | Password |
|------|-------|----------|
| Mahmud Admin | Mahmud.Admin@gmail.com | Mahmud@#1234 |
| Tanvir Ahmed | tanvir@admin.careconnect.com | tanvir@123 |

**Parents:**
| Name | Email | Password |
|------|-------|----------|
| Farzana Rahman | farzana.rahman@careconnect.com | pass123 |
| Tania Karim | tania.karim@careconnect.com | tania999 |
| Lamia Mahzabin | lamia.mahzabin@careconnect.com | lamia789 |

**Babysitters:**
| Name | Email | Password |
|------|-------|----------|
| Munim Hasan | munim.hasan@gmail.com | Pass123 |
| Nusrat Jahan | nusrat.jahan@gmail.com | Pass132 |

> ⚠️ All passwords are hashed with bcrypt during seeding. Use the plain-text passwords shown above to log in.

### Testing Workflow

1. **Registration & Approval Flow**
   - Register as a new babysitter → Admin approves → Babysitter can accept bookings

2. **Booking Flow**
   - Parent finds sitter → Creates booking → Sitter confirms → Payment → Live session → Review

3. **Emergency Flow**
   - User triggers SOS alert → Admin receives notification → Admin resolves alert

---

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **MongoDB connection failed** | Ensure MongoDB is running: `mongod` or check your Atlas connection string in `DATABASE_URL` |
| **`next: not found`** | Run `npm install --legacy-peer-deps` in the frontend directory |
| **CORS errors** | Verify `CLIENT_URL` in backend `.env` matches your frontend origin |
| **Email not sending** | Check `SMTP_USER` and `SMTP_PASS` in `.env`. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) |
| **Stripe payments not working** | Ensure `STRIPE_SECRET_KEY` (backend) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (frontend) are set |
| **JWT errors** | Ensure `JWT_SECRET` is set in backend `.env` |
| **Prisma schema errors** | Run `npx prisma generate` after any schema changes |
| **Port already in use** | Change `PORT` in backend `.env` or kill the process: `lsof -ti:5000 \| xargs kill` |

### Useful Commands

```bash
# Backend
npm run dev              # Start dev server with hot reload
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:push      # Push schema changes to MongoDB
npm run prisma:studio    # Open visual database browser
npm run prisma:seed      # Re-seed the database
npm run db:push          # Push schema + seed (combined)

# Frontend
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run lint             # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Backend: ES Modules (`import/export`), async/await pattern
- Frontend: TypeScript, functional components, Tailwind CSS utility classes
- Use Prisma for all database operations — no raw queries
- Follow RESTful API conventions

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">

**Built with ❤️ for safer, smarter childcare.**

</div>