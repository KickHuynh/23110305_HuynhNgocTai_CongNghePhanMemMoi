# Frontend Auth Testing Guide

Frontend base URL: `http://localhost:5173`  
Backend base URL: `http://localhost:5000/api`

Before testing:

1. Start backend:
   - `cd backend`
   - `npm run dev`
2. Start frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. Make sure backend `.env` contains:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_FROM`

## 1. Register

Page URL: `http://localhost:5173/register`  
Related backend API: `POST /api/auth/register`

Action:

1. Enter `fullName`
2. Enter valid `email`
3. Enter `studentId`
4. Enter `password` with at least 6 characters
5. Submit the form

Expected frontend behavior:

- Client-side validation blocks empty or invalid fields
- Success redirects to `/verify-otp`
- Registered email is prefilled on the OTP page
- Error message is shown if email or student ID already exists

## 2. Verify OTP

Page URL: `http://localhost:5173/verify-otp`  
Related backend API: `POST /api/auth/verify-register-otp`

Action:

1. Confirm email is correct or type it manually
2. Enter the 6-digit OTP from email
3. Submit the form

Expected frontend behavior:

- OTP must be 6 digits
- Success stores JWT token in localStorage
- User data is stored in localStorage
- Redirect follows backend `redirectUrl`
  - student -> `/user/profile`
  - admin -> `/admin/profile`
- Error message appears for invalid or expired OTP

## 3. Login

Page URL: `http://localhost:5173/login`  
Related backend API: `POST /api/auth/login`

Action:

1. Enter valid email and password
2. Submit the form

Expected frontend behavior:

- Client-side validation checks email format and password presence
- Success stores token and user in localStorage
- Redirect follows backend `redirectUrl`
- If backend returns unverified email message, frontend redirects to `/verify-otp`

## 4. User Profile

Page URL: `http://localhost:5173/user/profile`  
Related backend API: `GET /api/auth/me`

Action:

1. Login as student
2. Open `/user/profile`

Expected frontend behavior:

- Route is protected
- If token is missing, user is redirected to `/login`
- Page loads and displays:
  - `fullName`
  - `email`
  - `studentId`
  - `role`
  - `isEmailVerified`

## 5. Edit Profile

Page URL: `http://localhost:5173/user/profile`  
Related backend API: `PUT /api/auth/me`

Action:

1. Click `Edit profile`
2. Change `fullName`, `email`, or `studentId`
3. Click `Save changes`

Expected frontend behavior:

- Role is not editable
- Password is not editable here
- Success message appears after save
- Displayed profile data refreshes immediately
- Stored user in localStorage is updated
- Duplicate email or student ID shows backend error message

## 6. Forgot Password

Page URL: `http://localhost:5173/forgot-password`  
Related backend API: `POST /api/auth/forgot-password`

Action:

1. Enter registered email
2. Submit the form

Expected frontend behavior:

- Email format is validated
- Success redirects to `/reset-password`
- Email is prefilled for reset flow
- Clear message indicates OTP was sent

## 7. Reset Password

Page URL: `http://localhost:5173/reset-password`  
Related backend API: `POST /api/auth/reset-password`

Action:

1. Confirm email
2. Enter 6-digit OTP
3. Enter new password with at least 6 characters
4. Submit the form

Expected frontend behavior:

- Client-side validation checks email, OTP, and password
- Success redirects to `/login`
- Login page shows success message from reset flow

## 8. Admin Redirect

Page URL: `http://localhost:5173/admin/profile`  
Related backend APIs:

- `POST /api/auth/login`
- `GET /api/auth/me`

Action:

1. Login with an admin account
2. Check redirect target
3. Open `/admin/profile`

Expected frontend behavior:

- Backend redirectUrl sends admin to `/admin/profile`
- Route is protected for role `admin`
- Page displays admin info
- Page shows message: `Admin dashboard features will be developed later.`

## 9. Logout

Visible from navbar after login  
Related frontend behavior only

Action:

1. Click `Logout`

Expected frontend behavior:

- Token is removed from localStorage
- Stored user is removed from localStorage
- User is redirected to `/login`
