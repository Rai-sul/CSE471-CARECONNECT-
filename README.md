# 🌿 CareConnect — Advanced Babysitter Booking Platform

[![Frontend](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react)](https://react.dev/)
[![Build Tool](https://img.shields.io/badge/Build-Vite_7-646CFF?logo=vite)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Express_5-000000?logo=express)](https://expressjs.com/)
[![Language](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**CareConnect** is a full-stack childcare platform that connects parents with verified babysitters through secure booking, smart babysitter matching, real-time communication, session tracking, payment management, emergency alerts, and admin-controlled sitter approval.

The goal of CareConnect is to make childcare booking safer, easier, and more transparent for families while giving babysitters a professional platform to manage profiles, bookings, communication, and active sessions.

---

## 🔗 Live Experience

### 🌐 Live Demo

[CareConnect Live Demo](https://cse-471-careconnect-olive.vercel.app/)

You can test the platform using the following demo credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@careconnect.com` | `admin123` |
| **Parent** | `parent@careconnect.com` | `parent123` |
| **Sitter** | `sitter@careconnect.com` | `sitter123` |

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Frontend Routes](#-frontend-routes)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Key Features

### 👨‍👩‍👧 For Parents

- **Search & Filter Babysitters** — Find babysitters by hourly rate, experience, skills, age group, and availability.
- **Smart Match™ Suggestions** — Get suitable babysitter recommendations based on parent needs, sitter availability, experience, and service preferences.
- **Book Sessions** — Schedule babysitting sessions with date, time, babysitter, children, and special notes.
- **Manage Children** — Add, update, and remove child profiles, including medical notes, allergies, and emergency information.
- **Track Active Sessions** — View session status, activity logs, and babysitter GPS location updates during active bookings.
- **In-App Messaging** — Chat directly with babysitters for each booking.
- **Payments** — Manage payment records using card, wallet, or bank transfer options.
- **Reviews & Ratings** — Review babysitters after completed sessions.
- **Notifications** — Receive booking, payment, session, system, and SOS-related alerts.

### 🧑‍🍼 For Babysitters

- **Professional Profile** — Create a detailed profile with bio, skills, certifications, experience, hourly rate, availability, and service area.
- **Booking Management** — View incoming, active, completed, and cancelled bookings.
- **Session Controls** — Confirm, start, pause, resume, and complete babysitting sessions.
- **GPS Location Updates** — Share location updates with parents during active sessions.
- **SOS Emergency Alerts** — Send urgent alerts to parents and admins with location information.
- **Chat** — Communicate with parents through booking-based chat rooms.
- **Profile Management** — Update profile details and upload a profile picture.

### 🛡️ For Admins

- **Admin Dashboard** — View platform-wide statistics such as users, bookings, payments, revenue, and emergency alerts.
- **User Management** — View users and activate or deactivate accounts.
- **Babysitter Approvals** — Review babysitter profiles and approve or reject sitter registrations.
- **Booking Oversight** — Monitor all bookings across the platform.
- **Payment Tracking** — View all payment transactions.
- **SOS Alert Management** — Monitor and resolve emergency alerts.

### 🌐 General Platform Features

- **JWT Authentication** — Secure login and role-based access control.
- **Role-Based Dashboards** — Separate dashboards and permissions for parents, babysitters, and admins.
- **Email Notifications** — Transactional emails for registration, bookings, payments, and emergency alerts.
- **File Uploads** — Profile picture upload support using Multer.
- **Responsive UI** — Mobile-friendly interface with modern visual design.
- **Session Activity Logs** — Track important actions during babysitting sessions.
- **Secure API Structure** — Protected routes, authorization middleware, and service-based backend architecture.

---

## 👥 User Roles

CareConnect supports three main roles:

### Parent

Parents can register, manage children, search babysitters, book sessions, chat with babysitters, make payments, track sessions, receive notifications, and submit reviews.

### Babysitter

Babysitters can register, create a professional sitter profile, manage bookings, update session status, share location updates, send SOS alerts, and chat with parents.

> Babysitters must be approved by an admin before they appear in search results.

### Admin

Admins manage the platform, approve babysitters, monitor bookings, track payments, manage users, and resolve SOS alerts.

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| Node.js | 18+ | Runtime environment |
| Express.js | 5.2 | REST API framework |
| TypeScript | 5.9 | Type safety |
| Prisma ORM | 5.22 | Database ORM |
| MongoDB Atlas | — | Cloud database |
| JSON Web Token | 9.0 | Authentication |
| bcryptjs | 3.0 | Password hashing |
| Nodemailer | 8.0 | Email service |
| Multer | 2.1 | File upload handling |

### Frontend

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool and development server |
| React Router | 7.13 | Client-side routing |
| Axios | 1.13 | HTTP client |

### Architecture

CareConnect follows a clean full-stack architecture:

- **Frontend:** React + Vite single-page application.
- **Backend:** Express.js REST API.
- **Database:** MongoDB managed through Prisma ORM.
- **Authentication:** JWT-based authentication and authorization.
- **Communication:** Booking-based in-app chat.
- **Session Tracking:** Booking logs with live status and GPS updates.
- **Admin Control:** Admin-managed approval, users, bookings, payments, and alerts.

---

## 📂 Project Structure

```bash
CareConnect/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Layout.tsx
│   │   │       ├── Navbar.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── parent/
│   │   │   │   ├── ParentDashboard.tsx
│   │   │   │   ├── ChildrenPage.tsx
│   │   │   │   ├── SearchBabysittersPage.tsx
│   │   │   │   ├── BabysitterDetailPage.tsx
│   │   │   │   ├── BookingsPage.tsx
│   │   │   │   ├── BookingDetailPage.tsx
│   │   │   │   └── PaymentsPage.tsx
│   │   │   ├── babysitter/
│   │   │   │   ├── BabysitterDashboard.tsx
│   │   │   │   ├── BabysitterProfilePage.tsx
│   │   │   │   ├── BabysitterBookingsPage.tsx
│   │   │   │   └── SessionManagePage.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── UsersPage.tsx
│   │   │   │   ├── ApprovalsPage.tsx
│   │   │   │   ├── AdminBookingsPage.tsx
│   │   │   │   ├── AdminPaymentsPage.tsx
│   │   │   │   └── SOSAlertsPage.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── services/
│   │   │   └── api.ts               # Axios instance with JWT interceptor
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── App.tsx                  # Route definitions
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles and design system
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── controllers/             # HTTP request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── child.controller.ts
│   │   │   ├── babysitter.controller.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── review.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── notification.controller.ts
│   │   │   ├── sos.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── services/                # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── child.service.ts
│   │   │   ├── babysitter.service.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── review.service.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── sos.service.ts
│   │   │   └── admin.service.ts
│   │   ├── routes/                  # API route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── child.routes.ts
│   │   │   ├── babysitter.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── review.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── notification.routes.ts
│   │   │   ├── sos.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── upload.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT auth and role authorization
│   │   │   └── upload.ts            # Multer upload config
│   │   ├── utils/
│   │   │   ├── prisma.ts            # Prisma client instance
│   │   │   ├── jwt.ts               # Token generation and verification
│   │   │   └── email.ts             # Email sending utility
│   │   ├── app.ts                   # Express app setup and middleware
│   │   └── server.ts                # Server entry point
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── uploads/                     # Uploaded profile images
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── README.md
```

---

## 📋 Prerequisites

Before running the project, make sure you have:

- **Node.js v18 or higher**
- **npm v9 or higher**
- **MongoDB Atlas account** or a local MongoDB database
- **Git**

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CareConnect.git
cd CareConnect
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory.

Then generate Prisma client and push the schema to MongoDB:

```bash
npx prisma generate
npx prisma db push
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# Server
PORT=5000

# Database
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/careconnect

# JWT Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

> For Gmail SMTP, you must use a Google App Password. A normal Gmail password will not work if 2-Step Verification is enabled.

---

## ▶️ Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The backend runs on:

```bash
http://localhost:5000
```

### Start the Frontend Development Server

```bash
cd client
npm run dev
```

The frontend runs on:

```bash
http://localhost:3000
```

### Production Build

```bash
# Build frontend
cd client
npm run build

# Build backend
cd ../server
npm run build
npm start
```

---

## 🧪 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| Admin | `admin@careconnect.com` | `admin123` |
| Parent | `parent@careconnect.com` | `parent123` |
| Sitter | `sitter@careconnect.com` | `sitter123` |

---

## 🔑 Admin Account Creation

Admin registration is not exposed through the normal registration form for security reasons.

You can create an admin account through the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@careconnect.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "phone": "1234567890",
    "role": "ADMIN"
  }'
```

---

## 📡 API Endpoints

All endpoints are prefixed with:

```bash
/api
```

Authenticated endpoints require a Bearer token:

```bash
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| POST | `/api/auth/register` | ✗ | Register a new user |
| POST | `/api/auth/login` | ✗ | Login and receive JWT |
| GET | `/api/auth/me` | ✓ | Get current user profile |

### User Profile

| Method | Endpoint | Auth | Access | Description |
| :--- | :--- | :---: | :--- | :--- |
| PUT | `/api/users/profile` | ✓ | All | Update own profile |
| GET | `/api/users/all` | ✓ | Admin | List all users |
| PATCH | `/api/users/:id/toggle-status` | ✓ | Admin | Activate or deactivate user |

### File Upload

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| POST | `/api/upload` | ✓ | Upload profile image |

### Children

| Method | Endpoint | Auth | Access | Description |
| :--- | :--- | :---: | :--- | :--- |
| POST | `/api/children` | ✓ | Parent | Add a child |
| GET | `/api/children` | ✓ | Parent | List own children |
| PUT | `/api/children/:id` | ✓ | Parent | Update a child |
| DELETE | `/api/children/:id` | ✓ | Parent | Remove a child |

### Babysitters

| Method | Endpoint | Auth | Access | Description |
| :--- | :--- | :---: | :--- | :--- |
| POST | `/api/babysitters/profile` | ✓ | Babysitter | Create or update babysitter profile |
| GET | `/api/babysitters/profile/me` | ✓ | Babysitter | Get own babysitter profile |
| GET | `/api/babysitters/search` | ✓ | All | Search babysitters |
| GET | `/api/babysitters/:id` | ✓ | All | Get babysitter details |
| GET | `/api/babysitters/pending` | ✓ | Admin | List pending babysitter approvals |
| PATCH | `/api/babysitters/:id/approve` | ✓ | Admin | Approve or reject babysitter |

### Bookings

| Method | Endpoint | Auth | Access | Description |
| :--- | :--- | :---: | :--- | :--- |
| POST | `/api/bookings` | ✓ | Parent | Create booking |
| GET | `/api/bookings` | ✓ | Parent/Babysitter | List own bookings |
| GET | `/api/bookings/:id` | ✓ | Parent/Babysitter | Get booking details |
| PATCH | `/api/bookings/:id/status` | ✓ | Parent/Babysitter | Update booking status |
| POST | `/api/bookings/:id/location` | ✓ | Babysitter | Update GPS location |
| GET | `/api/bookings/:id/logs` | ✓ | Parent/Babysitter | Get session activity logs |
| GET | `/api/bookings/smart-match` | ✓ | Parent | Get smart matching suggestions |
| GET | `/api/bookings/all` | ✓ | Admin | List all bookings |

### Payments

| Method | Endpoint | Auth | Access | Description |
| :--- | :--- | :---: | :--- | :--- |
| POST | `/api/payments` | ✓ | Parent | Process payment |
| GET | `/api/payments` | ✓ | Parent | View own payment history |
| GET | `/api/payments/all` | ✓ | Admin | View all payments |

### Reviews

| Method | Endpoint | Auth | Access | Description |
| :--- | :--- | :---: | :--- | :--- |
| POST | `/api/reviews` | ✓ | Parent | Submit review |
| GET | `/api/reviews/babysitter/:id` | ✓ | All | Get reviews for babysitter |

### Chat

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | `/api/chat/rooms` | ✓ | List chat rooms |
| GET | `/api/chat/:roomId/messages` | ✓ | Get room messages |
| POST | `/api/chat/:roomId/messages` | ✓ | Send message |

### Notifications

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | `/api/notifications` | ✓ | List notifications |
| GET | `/api/notifications/unread-count` | ✓ | Get unread count |
| PATCH | `/api/notifications/:id/read` | ✓ | Mark one notification as read |
| PATCH | `/api/notifications/read-all` | ✓ | Mark all notifications as read |

### SOS Alerts

| Method | Endpoint | Auth | Access | Description |
| :--- | :--- | :---: | :--- | :--- |
| POST | `/api/sos` | ✓ | All | Send SOS alert |
| GET | `/api/sos/all` | ✓ | Admin | List all SOS alerts |
| PATCH | `/api/sos/:id/resolve` | ✓ | Admin | Resolve SOS alert |

### Admin

| Method | Endpoint | Auth | Access | Description |
| :--- | :--- | :---: | :--- | :--- |
| GET | `/api/admin/dashboard` | ✓ | Admin | Get platform statistics |

### Health Check

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | `/api/health` | ✗ | Server health check |

---

## 🗺️ Frontend Routes

### Public Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/login` | LoginPage | User login |
| `/register` | RegisterPage | User registration |

### Parent Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/parent/dashboard` | ParentDashboard | Parent overview |
| `/parent/children` | ChildrenPage | Manage children |
| `/parent/search` | SearchBabysittersPage | Search babysitters |
| `/parent/babysitter/:id` | BabysitterDetailPage | View babysitter and create booking |
| `/parent/bookings` | BookingsPage | View bookings |
| `/parent/bookings/:id` | BookingDetailPage | Booking details, payment, and review |
| `/parent/payments` | PaymentsPage | Payment history |

### Babysitter Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/babysitter/dashboard` | BabysitterDashboard | Babysitter overview |
| `/babysitter/profile` | BabysitterProfilePage | Edit professional profile |
| `/babysitter/bookings` | BabysitterBookingsPage | View bookings |
| `/babysitter/bookings/:id` | SessionManagePage | Manage active session |

### Admin Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/admin/dashboard` | AdminDashboard | Admin overview |
| `/admin/users` | UsersPage | User management |
| `/admin/approvals` | ApprovalsPage | Babysitter approvals |
| `/admin/bookings` | AdminBookingsPage | All bookings |
| `/admin/payments` | AdminPaymentsPage | All payments |
| `/admin/sos` | SOSAlertsPage | Emergency alert management |

### Shared Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/profile` | ProfilePage | Edit profile |
| `/chat` | ChatPage | In-app messaging |
| `/notifications` | NotificationsPage | Notification center |

---

## 🗄️ Database Schema

CareConnect uses **MongoDB** with **Prisma ORM**. The database schema includes the following main models:

### User

Stores account and authentication information.

| Field | Type | Description |
| :--- | :--- | :--- |
| id | String | Unique user identifier |
| email | String | Unique login email |
| password | String | Bcrypt-hashed password |
| firstName | String | User first name |
| lastName | String | User last name |
| phone | String | Contact number |
| role | Enum | `PARENT`, `BABYSITTER`, or `ADMIN` |
| profilePicture | String? | Profile image URL |
| isVerified | Boolean | Verification status |
| isActive | Boolean | Account status |

### Child

Stores child profiles managed by parents.

| Field | Type | Description |
| :--- | :--- | :--- |
| firstName | String | Child first name |
| lastName | String | Child last name |
| dateOfBirth | DateTime | Date of birth |
| gender | String | Child gender |
| allergies | String[] | Allergy list |
| specialNeeds | String? | Special needs notes |
| emergencyContact | String | Emergency contact information |

### BabysitterProfile

Stores babysitter professional information.

| Field | Type | Description |
| :--- | :--- | :--- |
| bio | String | Babysitter biography |
| experience | Int | Years of experience |
| skills | String[] | Skills such as CPR or First Aid |
| certifications | String[] | Professional certifications |
| hourlyRate | Float | Hourly rate |
| ageGroupMin | Int | Minimum accepted child age |
| ageGroupMax | Int | Maximum accepted child age |
| availability | Json | Weekly availability schedule |
| location | Json | Service area with latitude, longitude, and address |
| radius | Float | Service radius in kilometers |
| isApproved | Boolean | Admin approval status |
| averageRating | Float | Average review rating |
| totalReviews | Int | Total review count |

### Booking

Stores babysitting session information.

| Field | Type | Description |
| :--- | :--- | :--- |
| date | DateTime | Booking date |
| startTime | String | Session start time |
| endTime | String | Session end time |
| status | Enum | `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `PAUSED`, `COMPLETED`, or `CANCELLED` |
| totalAmount | Float | Total booking amount |
| notes | String? | Special instructions |
| latitude | Float? | Latest session latitude |
| longitude | Float? | Latest session longitude |

### Other Models

- **BookingChild** — Many-to-many relation between bookings and children.
- **SessionLog** — Activity logs for session actions and GPS coordinates.
- **Payment** — Payment method, transaction status, transaction ID, and payment date.
- **Review** — Babysitter ratings and parent comments.
- **ChatRoom** — Booking-based chat room.
- **Message** — Individual messages with sender and read status.
- **Notification** — In-app notifications for booking, payment, session, system, and SOS events.
- **SOSAlert** — Emergency alerts with GPS location and resolution status.

---

## 🧠 Smart Match™ Overview

CareConnect includes a smart matching flow to help parents find suitable babysitters.

The matching logic can consider:

- Babysitter availability
- Hourly rate
- Experience
- Skills and certifications
- Child age compatibility
- Location and service radius
- Approval status
- Rating and review history

This makes the search process easier for parents and helps babysitters receive more relevant booking requests.

---

## 🛡️ Security Features

- JWT-based authentication
- Role-based route protection
- Password hashing with bcrypt
- Protected admin-only endpoints
- Auth middleware for private routes
- File upload handling through controlled middleware
- Environment-based secret management
- Account activation and deactivation support

---

## 💳 Payment System

CareConnect supports payment records for babysitting sessions.

Supported payment methods include:

- Card
- Digital wallet
- Bank transfer

Admins can view all payment records, while parents can view their own payment history.

---

## 🚨 Emergency SOS Flow

During an active session, a babysitter can trigger an SOS alert.

The alert can include:

- Booking information
- Babysitter information
- Parent information
- GPS location
- Emergency message
- Resolution status

Admins can monitor and resolve SOS alerts through the admin dashboard.

---

## 📸 Screenshots

> Screenshots can be added here after running the application.

```md
### Login Page
![Login](screenshots/login.png)

### Parent Dashboard
![Parent Dashboard](screenshots/parent-dashboard.png)

### Babysitter Search
![Babysitter Search](screenshots/search.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## 🧭 Future Improvements

The following features can be added in future versions:

- Stripe payment gateway integration
- Stream Chat or Socket.IO-based real-time messaging
- Stream Video or WebRTC-based video interviews
- Background verification reports
- Subscription plans such as Standard, Premium, and Diamond
- Advanced AI recommendation engine
- Push notifications
- Calendar integration
- Improved location tracking with maps

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Commit your changes:

```bash
git commit -m "Add your feature"
```

4. Push to the branch:

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

## 📜 License

This project uses the **ISC License**.

---

## 🎓 Academic Note

CareConnect was developed as part of a university course project.
