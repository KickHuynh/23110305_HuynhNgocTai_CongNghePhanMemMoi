# Sneaker Shop - Fullstack E-commerce Web Application

Sneaker Shop is a portfolio-ready fullstack e-commerce demo built with React, Express, and MongoDB. It started as a university practice project for the course `Công nghệ phần mềm mới`, and has been upgraded into a cleaner, more professional showcase project for internship applications.

## Project Overview

This project demonstrates a simple sneaker storefront with:

- JWT-based user authentication
- Product listing with filtering, sorting, and pagination
- Product detail pages with image gallery and related products
- Category-based product browsing
- Responsive modern UI built for portfolio presentation

The current scope focuses on a clean product-browsing experience without introducing checkout or admin complexity yet.

## Features

- Register, login, and profile pages connected to the existing Express auth API
- Homepage sections for promotions, new arrivals, best sellers, and rankings
- Product search page with keyword, category, brand, price, size, color, stock, and promotion filters
- Product detail page with image swiper, stock state, size/color selection, and related products
- Category page with grouped product sections and infinite scroll
- Shared API layer with `axiosClient`, `productApi`, and `authApi`
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

More detailed endpoint documentation is available in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## Current Limitations

- Cart, order, payment, wishlist, and admin dashboard features are not implemented yet
- The current add-to-cart button on the product detail page is UI-only
- There is no automated test suite yet
- The project is currently configured for local MongoDB development

## Future Improvements

- Add cart and checkout flow
- Add order history and payment integration
- Add admin product management
- Add automated tests and deployment guides
- Add richer validation, logging, and production configuration
