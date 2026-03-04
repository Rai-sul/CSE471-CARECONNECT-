# KINDER2 Setup Instructions

## Database Setup

1. **Start XAMPP/WAMP MySQL service**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Import Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create database named `kinder`
   - Import `kinder db.sql` file

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   - Open `backend/.env`
   - Update email credentials for notifications:
     
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-app-password
     ```
   - For Gmail: Enable 2FA and generate App Password
   - Guide: https://support.google.com/accounts/answer/185833

3. **Run Backend Server**
   ```bash
   npm run dev
   ```
   - Server will run on http://localhost:3001

## Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run Frontend**
   ```bash
   npm run dev
   ```
   - Frontend will run on http://localhost:5173

## Video Conferencing (Yoom)

1. **Setup Clerk Authentication**
   - Visit https://clerk.com
   - Create account and get API keys
   - Create `yoom/.env.local`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
     CLERK_SECRET_KEY=your_secret
     ```

2. **Setup Stream Video SDK**
   - Visit https://getstream.io
   - Create account and get API keys
   - Add to `yoom/.env.local`:
     ```
     NEXT_PUBLIC_STREAM_API_KEY=your_key
     STREAM_SECRET_KEY=your_secret
     ```

3. **Run Yoom Server**
   ```bash
   cd yoom
   npm install
   npm run dev
   ```
   - Video conferencing will run on http://localhost:3000

## New Features Implemented

### 1. Password Hashing (bcrypt)
- All passwords are now securely hashed
- Existing plain-text passwords in DB will need re-registration

### 2. Email Notifications
- Approval/Rejection emails
- Meeting link sharing emails
- Payment confirmation emails
- Booking request notifications

### 3. Parent Profile Management
- Update child stubbornness level (1-5)
- Set days needed per week
- Set budget amount
- Add personal situation description
- Access via: `/Dashboard/ParentProfile`

### 4. Payment History
- View all past transactions
- See total amount paid
- Transaction details with dates
- Access via: `/Dashboard/PaymentHistory`

### 5. Admin User Monitoring
- View all registered parents and babysitters
- Block/Unblock suspicious users
- Filter by role (parent/babysitter)
- Real-time status updates
- Access via: `/Admin_dashboard/UserMonitoring`

### 6. Database Schema Improvements
- Added primary key to `confirmation` table
- Created `class_links` table for class link management
- Created `consultation_slots` table for appointment scheduling
- Added `status` column to `parent` and `babysitter` tables for blocking

## Testing the System

### Test Accounts

**Admin:**
- Email: ayesha@kinder.admin.ac.bd
- Password: pass1234 (re-register for hashed password)

**Parent:**
- Email: tania@kinder.ac.bd
- Password: tania999 (re-register for hashed password)

**Babysitter:**
- Email: dipto@gmail.com
- Password: Pass123 (re-register for hashed password)

### Feature Testing Workflow

1. **Registration & Approval**
   - Register as parent/babysitter
   - Admin approves from Admin Dashboard
   - Check email for approval notification

2. **Parent Profile**
   - Login as parent
   - Click "Update Profile"
   - Fill in child details, days needed, budget
   - Save changes

3. **Find Babysitter**
   - Parent: Click "Find a baby sitter"
   - View map with available babysitters
   - Select date and submit request
   - Babysitter receives email notification

4. **Babysitter Response**
   - Login as babysitter
   - Update location via "Update Information"
   - Set availability status via "Update Status"
   - View booking requests in Consultation
   - Accept and share meeting link
   - Parent receives email with meeting link

5. **Payment**
   - Parent: Click "Renew Subscription"
   - Select payment plan
   - Pay with bKash
   - Receive payment confirmation email
   - View history in "Payment History"

6. **Admin Monitoring**
   - Login as admin
   - Access "User Monitoring"
   - View all users
   - Block/Unblock suspicious accounts

## Troubleshooting

### Database Connection Failed
- Ensure MySQL is running in XAMPP/WAMP
- Check database name is `kinder`
- Verify credentials in `.env`

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`
- For Gmail: Must use App Password, not regular password
- Enable "Less secure app access" or use App Password

### Port Already in Use
- Backend (3001): Change PORT in `.env`
- Frontend (5173): Change in `vite.config.js`
- Yoom (3000): Change in `package.json`

## API Endpoints

### Authentication
- POST `/api/register` - Register new user
- POST `/api/login` - Login user

### Parent
- POST `/api/update-parent-profile` - Update parent profile
- GET `/api/parent-profile/:id` - Get parent profile
- GET `/api/payment-history/:parentId` - Get payment history

### Babysitter
- POST `/api/update-location` - Update location & availability
- POST `/api/set-status` - Toggle active status
- GET `/api/sitter-requests` - Get booking requests
- POST `/api/confirm-request` - Accept booking

### Admin
- POST `/api/accept-parent` - Approve parent
- POST `/api/reject-parent` - Reject parent
- POST `/api/accept-babysitter` - Approve babysitter
- POST `/api/reject-babysitter` - Reject babysitter
- POST `/api/block-user` - Block/Unblock user
- GET `/api/all-users` - Get all users

### Booking
- POST `/api/confirm-sitter` - Create booking request
- POST `/api/meetlink` - Share meeting link

### Payment
- POST `/api/payment` - Record payment
- GET `/api/payment-history/:parentId` - Get payment history

## Security Notes

- All passwords are hashed with bcrypt (salt rounds: 10)
- Email credentials should never be committed to Git
- Use environment variables for sensitive data
- Regularly update dependencies for security patches

## Support

For issues or questions:
1. Check console logs for errors
2. Verify database tables exist
3. Ensure all services are running
4. Check network requests in browser DevTools
