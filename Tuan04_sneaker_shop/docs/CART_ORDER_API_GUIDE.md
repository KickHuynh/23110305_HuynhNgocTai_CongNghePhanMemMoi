# Cart and Order API Guide

Base URL:

```txt
http://localhost:5000/api
```

Protected endpoints require:

```txt
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Response pattern:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

## Cart APIs

### GET `/cart`

Get the current user's cart.

Example response:

```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "cart": {
      "_id": "cart_id",
      "user": "user_id",
      "items": [],
      "totalItems": 0,
      "subtotal": 0,
      "createdAt": "2026-05-26T10:00:00.000Z",
      "updatedAt": "2026-05-26T10:00:00.000Z"
    }
  }
}
```

Notes:

- One cart is stored per user in MongoDB.
- Product name, image, price, and stock snapshot are stored in cart items for UI display.

### POST `/cart/items`

Add an item to cart or increase quantity if the same `product + size + color` already exists.

Request body:

```json
{
  "productId": "68344b2f1ab2345678901234",
  "size": "42",
  "color": "Black",
  "quantity": 1
}
```

Example response:

```json
{
  "success": true,
  "message": "Added product to cart successfully",
  "data": {
    "cart": {
      "items": [
        {
          "_id": "cart_item_id",
          "product": "68344b2f1ab2345678901234",
          "name": "Nike Air Max",
          "image": "https://...",
          "price": 1790000,
          "size": "42",
          "color": "Black",
          "quantity": 1,
          "stockSnapshot": 12
        }
      ],
      "totalItems": 1,
      "subtotal": 1790000
    }
  }
}
```

Notes:

- `productId`, `size`, `color`, and `quantity >= 1` are required.
- Backend validates product existence, active status, and stock before saving.
- Unit price uses `salePrice` when available, otherwise `price`.

### PUT `/cart/items/:itemId`

Update quantity for one cart item.

Request body:

```json
{
  "quantity": 2
}
```

Example response:

```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "cart": {
      "totalItems": 2,
      "subtotal": 3580000
    }
  }
}
```

Notes:

- Quantity must remain at least `1`.
- Stock is revalidated against the current product stock.

### DELETE `/cart/items/:itemId`

Remove one item from cart.

### DELETE `/cart`

Clear the current user's cart.

## Order APIs

### POST `/orders/checkout`

Create a new COD order from the current cart.

Request body:

```json
{
  "shippingAddress": {
    "fullName": "Huynh Ngoc Tai",
    "phone": "0900000000",
    "addressLine": "Thu Duc",
    "ward": "Linh Trung",
    "district": "Thu Duc",
    "city": "Ho Chi Minh City",
    "note": "Call before delivery"
  },
  "paymentMethod": "COD"
}
```

Notes:

- Only `COD` is supported right now.
- Backend revalidates stock and product status before creating the order.
- Product stock is reduced and `sold` is increased when checkout succeeds.
- Shipping fee is `30000` if subtotal is below `1000000`, otherwise free.

### GET `/orders/my-orders`

Get the logged-in user's order history.

### GET `/orders/:orderId`

Get one order detail for the current logged-in user only.

### PUT `/orders/:orderId/cancel`

Cancel a new/confirmed order within 30 minutes, or send a cancellation request when the order is already `preparing`.

Request body:

```json
{
  "reason": "Need to change size"
}
```

Notes:

- `new` and `confirmed` orders can be cancelled only within 30 minutes after `createdAt`.
- `preparing` orders are not cancelled immediately; they become `cancel_requested`.
- `shipping` and `delivered` orders cannot be cancelled by users.
- When an order is fully cancelled, stock is restored and `sold` is decreased.

### PUT `/orders/:orderId/status`

Optional admin-only route for manual status updates.

Request body:

```json
{
  "status": "shipping",
  "note": "Handed over to delivery partner"
}
```

## Order Status Reference

- `new`: New order
- `confirmed`: Confirmed order
- `preparing`: Shop is preparing goods
- `shipping`: Shipping
- `delivered`: Delivered successfully
- `cancelled`: Cancelled order
- `cancel_requested`: Cancellation request sent to shop

## Auto Confirmation Rule

- A lightweight background job runs inside the backend process every 5 minutes.
- Orders still in `new` status for more than 30 minutes are automatically changed to `confirmed`.
- The status history logs this change with `changedBy: "system"`.
