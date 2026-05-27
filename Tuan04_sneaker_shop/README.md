# Sneaker Shop - Fullstack E-commerce Web Application

Sneaker Shop is a portfolio-ready fullstack e-commerce demo built with React, Express, and MongoDB. It started as a university practice project for the course `Công nghệ phần mềm mới`, and has been upgraded into a cleaner, more professional showcase project for internship applications.

## Project Overview

This project demonstrates a simple sneaker storefront with:

- JWT-based user authentication
- Product listing with filtering, sorting, and pagination
- Product detail pages with image gallery and related products
- MongoDB-backed cart persistence per user
- COD checkout flow with shipping address capture
- User order history and order tracking timeline
- 30-minute cancellation logic with cancellation-request flow for preparing orders
- Category-based product browsing
- Responsive modern UI built for portfolio presentation

The current scope now covers the core student e-commerce journey from product browsing to cart, COD checkout, and order tracking without adding a real online payment gateway yet.

## Features

- Register, login, and profile pages connected to the existing Express auth API
- Homepage sections for promotions, new arrivals, best sellers, and rankings
- Product search page with keyword, category, brand, price, size, color, stock, and promotion filters
- Product detail page with image swiper, stock state, size/color selection, and real Add to Cart flow
- Protected cart page with quantity updates, item removal, and clear-cart support
- COD checkout page with shipping address form and pricing summary
- Order history page for logged-in users
- Order detail page with Vietnamese status labels and status history timeline
- Automatic order confirmation after 30 minutes if the order remains new
- Cancellation rules:
  - New/confirmed orders can be cancelled within 30 minutes
  - Preparing orders become `cancel_requested` instead of direct cancellation
- Category page with grouped product sections and infinite scroll
- Shared API layer with `axiosClient`, `productApi`, `authApi`, `cartApi`, and `orderApi`
- Environment-based frontend API configuration via `VITE_API_URL`

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Dotenv
- CORS
- Nodemon

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Swiper
- Ant Design icons/components
- LocalStorage

## Folder Structure

```txt
Tuan04_sneaker_shop
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── seed
│   │   ├── services
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── docs
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_DESIGN.md
│   └── ROADMAP.md
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   │   ├── common
│   │   │   ├── layout
│   │   │   └── products
│   │   ├── pages
│   │   ├── routes
│   │   ├── styles
│   │   ├── utils
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Backend Setup

```bash
cd Tuan04_sneaker_shop/backend
npm install
npm run dev
```

Create `backend/.env` from `backend/.env.example` before starting the server.

Default backend URL:

```txt
http://localhost:5000
```

## Frontend Setup

```bash
cd Tuan04_sneaker_shop/frontend
npm install
npm run dev
```

Create `frontend/.env` from `frontend/.env.example` before starting the client.

Default frontend URL:

```txt
http://localhost:5173
```

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sneaker_shop
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Seed Database

The backend includes product seed data for local development.

```bash
cd Tuan04_sneaker_shop/backend
npm run seed
```

Seeded database name:

```txt
sneaker_shop
```

## Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/categories`
- `GET /api/products/new`
- `GET /api/products/best-seller`
- `GET /api/products/promotions`
- `GET /api/products/top/best-sellers`
- `GET /api/products/top/most-viewed`
- `GET /api/products/:identifier`
- `GET /api/products/:identifier/related`
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `DELETE /api/cart`
- `POST /api/orders/checkout`
- `GET /api/orders/my-orders`
- `GET /api/orders/:orderId`
- `PUT /api/orders/:orderId/cancel`

More detailed endpoint documentation is available in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) and [docs/CART_ORDER_API_GUIDE.md](docs/CART_ORDER_API_GUIDE.md).

## Current Limitations

- Only COD payment is implemented; there is no real online payment gateway yet
- Admin order-management UI is not implemented yet, even though an admin status-update API is available
- There is no automated test suite yet
- The project is currently configured for local MongoDB development

## Future Improvements

- Add MoMo/ZaloPay or other e-wallet integration
- Add admin order management screens
- Add admin product management
- Add automated tests and deployment guides
- Add richer validation, logging, and production configuration
