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
