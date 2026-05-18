# TUẦN 03 - FULLSTACK EXPRESSJS REACTJS MONGODB

## 1. Thông tin sinh viên

- Họ và tên: Huỳnh Ngọc Tài
- MSSV: 23110305
- Môn học: Công nghệ phần mềm mới
- Nội dung thực hành: Xây dựng ứng dụng FullStack với ExpressJS, ReactJS và MongoDB

---

## 2. Mục tiêu bài thực hành

Bài thực hành tuần 03 tập trung xây dựng một ứng dụng FullStack cơ bản gồm Backend API và Frontend giao diện người dùng.

Ứng dụng thực hiện các chức năng chính:

- Đăng ký tài khoản người dùng
- Đăng nhập tài khoản
- Xác thực người dùng bằng JWT
- Lấy thông tin người dùng hiện tại
- Kết nối Frontend ReactJS với Backend ExpressJS thông qua Axios
- Lưu trữ dữ liệu người dùng vào MongoDB bằng Mongoose

---

## 3. Công nghệ sử dụng

### Backend

- NodeJS
- ExpressJS
- MongoDB
- Mongoose
- JSON Web Token
- Bcrypt
- Dotenv
- CORS
- Nodemon

### Frontend

- ReactJS
- Vite
- Axios
- React Router DOM
- Ant Design
- LocalStorage

---

## 4. Cấu trúc thư mục

```txt
Tuan03_FullStack_ExpressJS_ReactJS_MongoDB
│
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── database.js
│   │   ├── controllers
│   │   │   ├── authController.js
│   │   │   └── userController.js
│   │   ├── middleware
│   │   │   └── authMiddleware.js
│   │   ├── models
│   │   │   └── User.js
│   │   ├── routes
│   │   │   └── authRoutes.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── frontend
    ├── src
    │   ├── api
    │   │   └── axiosClient.js
    │   ├── components
    │   │   └── Navbar.jsx
    │   ├── pages
    │   │   ├── LoginPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── styles
    │   │   └── global.css
    │   ├── App.jsx
    │   └── main.jsx
    │
    └── package.json