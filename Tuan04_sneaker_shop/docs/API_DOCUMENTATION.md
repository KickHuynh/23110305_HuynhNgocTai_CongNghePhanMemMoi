# API Documentation

This document describes the currently implemented Sneaker Shop backend APIs only.

For detailed cart and order examples, see [docs/CART_ORDER_API_GUIDE.md](./CART_ORDER_API_GUIDE.md).

Base URL:

```txt
http://localhost:5000/api
```

## Response pattern

Most endpoints return this structure:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

Authentication endpoints also include `token` at the top level for login and register responses.

## Authentication

### POST `/auth/register`

Create a new user account.

Request body:

```json
{
  "fullName": "Huynh Ngoc Tai",
  "email": "tai@example.com",
  "studentId": "23110305",
  "password": "123456"
}
```

Success response:

```json
{
  "success": true,
  "message": "Register successfully",
  "token": "jwt-token",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "Huynh Ngoc Tai",
      "email": "tai@example.com",
      "studentId": "23110305",
      "role": "student"
    }
  }
}
```

### POST `/auth/login`

Authenticate an existing user.

Request body:

```json
{
  "email": "tai@example.com",
  "password": "123456"
}
```

Success response shape matches register.

### GET `/auth/me`

Get the currently authenticated user.

Headers:

```txt
Authorization: Bearer <jwt-token>
```

Success response:

```json
{
  "success": true,
  "message": "Get current user successfully",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "Huynh Ngoc Tai",
      "email": "tai@example.com",
      "studentId": "23110305",
      "role": "student"
    }
  }
}
```

## Products

### GET `/products`

Get paginated product data.

Supported query params:

- `keyword`
- `category`
- `brand`
- `minPrice`
- `maxPrice`
- `size`
- `color`
- `inStock=true|false`
- `isPromotion=true|false`
- `isNewProduct=true|false`
- `isBestSeller=true|false`
- `sort=newest|best_seller|most_viewed|price_asc|price_desc`
- `page`
- `limit`

Success response:

```json
{
  "success": true,
  "message": "Get products successfully",
  "data": {
    "products": [],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 0,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### GET `/products/categories`

Get all active product categories.

### GET `/products/new`

Get up to 8 active products marked with `isNewProduct`.

### GET `/products/best-seller`

Get up to 8 active products marked with `isBestSeller`.

### GET `/products/promotions`

Get up to 8 active products marked with `isPromotion`.

### GET `/products/top/best-sellers`

Get top-selling active products.

Optional query params:

- `limit`

### GET `/products/top/most-viewed`

Get most-viewed active products.

Optional query params:

- `limit`

### GET `/products/:identifier`

Get a single product by MongoDB `_id` or product `slug`.

Notes:

- The backend increments the product `views` count when this endpoint is called successfully.

### GET `/products/:identifier/related`

Get related active products from the same category as the selected product.

Notes:

- `:identifier` accepts MongoDB `_id` or product `slug`.
- The current implementation returns up to 4 products.

## Error responses

Common error structure:

```json
{
  "success": false,
  "message": "Public error message",
  "error": "Detailed internal message"
}
```

## Cart and Orders

The backend now also includes cart, checkout, and order tracking APIs.

Available endpoints:

- `GET /cart`
- `POST /cart/items`
- `PUT /cart/items/:itemId`
- `DELETE /cart/items/:itemId`
- `DELETE /cart`
- `POST /orders/checkout`
- `GET /orders/my-orders`
- `GET /orders/:orderId`
- `PUT /orders/:orderId/cancel`
- `PUT /orders/:orderId/status` (admin only)

Key rules:

- Cart and order endpoints are protected by JWT authentication.
- COD is the only supported payment method for now.
- New orders can be auto-confirmed after 30 minutes.
- Users can cancel `new` and `confirmed` orders only within 30 minutes.
- `preparing` orders switch to `cancel_requested` instead of immediate cancellation.
