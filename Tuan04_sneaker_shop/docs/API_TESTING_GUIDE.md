# API Testing Guide

Base URL: `http://localhost:5000/api`

Recommended testing order:
1. `GET /health`
2. `GET /products`
3. `GET /products/:id`
4. `POST /auth/register`
5. `POST /auth/verify-register-otp`
6. `POST /auth/login`
7. `GET /auth/me`
8. `PUT /auth/me`
9. `POST /auth/forgot-password`
10. `POST /auth/reset-password`

## 1. Health Check

Method: `GET`  
URL: `http://localhost:5000/api/health`  
Headers: None  
Body example: None  
Expected response:

```json
{
  "success": true,
  "message": "Sneaker Shop API is running"
}
```

Notes:
- Use this first to confirm the backend starts correctly.

## 2. Register

Method: `POST`  
URL: `http://localhost:5000/api/auth/register`  
Headers:
- `Content-Type: application/json`

Body example:

```json
{
  "fullName": "Nguyen Van A",
  "email": "student01@example.com",
  "studentId": "23110305",
  "password": "123456"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Register successfully. Please verify OTP sent to your email.",
  "data": {
    "user": {
      "id": "USER_ID",
      "fullName": "Nguyen Van A",
      "email": "student01@example.com",
      "studentId": "23110305",
      "role": "student",
      "isEmailVerified": false
    }
  }
}
```

Notes:
- No token is returned before OTP verification.
- Rate limit: 5 requests per 15 minutes.
- Check the email inbox for the 6-digit OTP.

## 3. Verify Register OTP

Method: `POST`  
URL: `http://localhost:5000/api/auth/verify-register-otp`  
Headers:
- `Content-Type: application/json`

Body example:

```json
{
  "email": "student01@example.com",
  "otp": "123456"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Verify register OTP successfully",
  "token": "JWT_TOKEN",
  "redirectUrl": "/user/profile",
  "data": {
    "token": "JWT_TOKEN",
    "redirectUrl": "/user/profile",
    "user": {
      "id": "USER_ID",
      "fullName": "Nguyen Van A",
      "email": "student01@example.com",
      "studentId": "23110305",
      "role": "student",
      "isEmailVerified": true
    }
  }
}
```

Notes:
- For an admin account, `redirectUrl` should be `/admin/profile`.
- Rate limit: 5 requests per 10 minutes.

## 4. Login

Method: `POST`  
URL: `http://localhost:5000/api/auth/login`  
Headers:
- `Content-Type: application/json`

Body example:

```json
{
  "email": "student01@example.com",
  "password": "123456"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Login successfully",
  "token": "JWT_TOKEN",
  "redirectUrl": "/user/profile",
  "data": {
    "token": "JWT_TOKEN",
    "redirectUrl": "/user/profile",
    "user": {
      "id": "USER_ID",
      "fullName": "Nguyen Van A",
      "email": "student01@example.com",
      "studentId": "23110305",
      "role": "student",
      "isEmailVerified": true
    }
  }
}
```

Notes:
- Unverified users should receive: `Please verify your email before login`.
- Rate limit: 5 requests per 15 minutes.

## 5. Get Current User

Method: `GET`  
URL: `http://localhost:5000/api/auth/me`  
Headers:
- `Authorization: Bearer JWT_TOKEN`

Body example: None  
Expected response:

```json
{
  "success": true,
  "message": "Get current user successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "fullName": "Nguyen Van A",
      "email": "student01@example.com",
      "studentId": "23110305",
      "role": "student",
      "isEmailVerified": true
    }
  }
}
```

Notes:
- Use the token from verify OTP or login.

## 6. Update Profile

Method: `PUT`  
URL: `http://localhost:5000/api/auth/me`  
Headers:
- `Content-Type: application/json`
- `Authorization: Bearer JWT_TOKEN`

Body example:

```json
{
  "fullName": "Nguyen Van A Updated",
  "email": "student01.updated@example.com",
  "studentId": "23110305A"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Update profile successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "fullName": "Nguyen Van A Updated",
      "email": "student01.updated@example.com",
      "studentId": "23110305A",
      "role": "student",
      "isEmailVerified": true
    }
  }
}
```

Notes:
- Do not send `role` or `password` in the body.
- Duplicate email or student ID should return `409`.

## 7. Forgot Password

Method: `POST`  
URL: `http://localhost:5000/api/auth/forgot-password`  
Headers:
- `Content-Type: application/json`

Body example:

```json
{
  "email": "student01.updated@example.com"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Password reset OTP sent to your email",
  "data": null
}
```

Notes:
- Rate limit: 3 requests per 15 minutes.
- Check the inbox for the reset OTP.

## 8. Reset Password

Method: `POST`  
URL: `http://localhost:5000/api/auth/reset-password`  
Headers:
- `Content-Type: application/json`

Body example:

```json
{
  "email": "student01.updated@example.com",
  "otp": "654321",
  "newPassword": "654321"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Reset password successfully",
  "data": null
}
```

Notes:
- Rate limit: 5 requests per 15 minutes.
- After reset, test login again with the new password.

## Validation Error Format

Any validation middleware failure returns:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "error message 1",
    "error message 2"
  ]
}
```

## 9. Product List

Method: `GET`  
URL: `http://localhost:5000/api/products`  
Headers: None  
Body example: None  
Expected response:

```json
{
  "success": true,
  "message": "Get products successfully",
  "data": {
    "products": [],
    "pagination": {
      "page": 1,
      "limit": 8,
      "total": 0,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

Notes:
- This route should still work after the auth changes.
- You can also test query params such as `page`, `limit`, `keyword`, `category`, and `sort`.

## 10. Product Detail

Method: `GET`  
URL: `http://localhost:5000/api/products/:id`  
Headers: None  
Body example: None  
Expected response:

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Nike Air Max 270"
  }
}
```

Notes:
- `:id` can be a MongoDB ObjectId or a product slug supported by the current backend.
- Test one product returned from the product list API.
