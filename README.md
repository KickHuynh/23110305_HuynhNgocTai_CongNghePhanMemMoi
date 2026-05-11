# Tuần 02 - CRUD với ExpressJS, Sequelize và MySQL

## 1. Thông tin bài tập

- **Môn học:** Công nghệ phần mềm mới
- **Tuần:** Tuần 02
- **Chủ đề:** CRUD với ExpressJS - Sequelize - MySQL
- **Sinh viên thực hiện:** Huỳnh Ngọc Tài
- **Mã số sinh viên:** 23110305

## 2. Mô tả bài tập

Bài tập tuần 02 yêu cầu xây dựng một ứng dụng web cơ bản sử dụng **Node.js**, **ExpressJS**, **Sequelize ORM** và **MySQL** để thực hiện các chức năng CRUD.

Ứng dụng được xây dựng theo mô hình **MVC**, bao gồm các thành phần chính:

- **Model:** định nghĩa đối tượng dữ liệu và ánh xạ với bảng trong MySQL.
- **View:** hiển thị giao diện bằng EJS.
- **Controller:** nhận request từ người dùng, gọi service xử lý và trả về response.
- **Service:** xử lý nghiệp vụ CRUD.
- **Route:** định nghĩa các URL tương ứng với từng chức năng.

Trong bài này, em xây dựng chức năng CRUD cho đối tượng **Student**.

## 3. Công nghệ sử dụng

| Công nghệ     | Vai trò                                             |
| ------------- | --------------------------------------------------- |
| Node.js       | Nền tảng chạy JavaScript phía server                |
| ExpressJS     | Framework xây dựng web server, router và middleware |
| MySQL         | Hệ quản trị cơ sở dữ liệu                           |
| Sequelize     | ORM dùng để thao tác với MySQL                      |
| EJS           | Template engine để render giao diện HTML            |
| dotenv        | Quản lý biến môi trường                             |
| body-parser   | Đọc dữ liệu gửi từ form                             |
| nodemon       | Tự động khởi động lại server khi thay đổi code      |
| sequelize-cli | Hỗ trợ tạo và chạy migration                        |

## 4. Chức năng đã thực hiện

Ứng dụng hiện có các chức năng chính:

1. Hiển thị trang chủ.
2. Thêm mới sinh viên.
3. Hiển thị danh sách sinh viên.
4. Cập nhật thông tin sinh viên.
5. Xóa sinh viên.
6. Kết nối MySQL bằng Sequelize.
7. Tạo bảng dữ liệu bằng migration.
8. Tổ chức project theo mô hình MVC.

## 5. Cấu trúc thư mục

```txt
fulltack01/
│
├── src/
│   ├── config/
│   │   ├── config.json
│   │   ├── configdb.js
│   │   └── viewEngine.js
│   │
│   ├── controllers/
│   │   └── studentController.js
│   │
│   ├── migrations/
│   │   └── create-student.js
│   │
│   ├── models/
│   │   ├── index.js
│   │   └── student.js
│   │
│   ├── public/
│   │   └── css/
│   │       └── style.css
│   │
│   ├── route/
│   │   └── web.js
│   │
│   ├── services/
│   │   └── CRUDService.js
│   │
│   ├── views/
│   │   ├── home.ejs
│   │   ├── crud.ejs
│   │   └── students/
│   │       ├── findAllStudent.ejs
│   │       └── updateStudent.ejs
│   │
│   └── server.js
│
├── .babelrc
├── .env.example
├── .gitignore
├── .sequelizerc
├── package.json
├── package-lock.json
└── README.md
```

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
