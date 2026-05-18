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

# TUẦN 04 - FULLSTACK E-COMMERCE WEBSITE: SNEAKER SHOP

## 1. Thông tin sinh viên

- Họ và tên: Huỳnh Ngọc Tài
- MSSV: 23110305
- Môn học: Công nghệ phần mềm mới
- Nội dung thực hành: Xây dựng website bán hàng Sneaker Shop sử dụng ExpressJS, ReactJS, MongoDB và Tailwind CSS

---

## 2. Mục tiêu bài thực hành

Bài thực hành tuần 04 tập trung phát triển một website thương mại điện tử đơn giản dựa trên nền tảng FullStack đã xây dựng ở tuần 03.

Ứng dụng sử dụng backend ExpressJS kết hợp MongoDB để quản lý dữ liệu sản phẩm, đồng thời frontend ReactJS hiển thị giao diện bán hàng hiện đại bằng Tailwind CSS.

Các mục tiêu chính của bài thực hành:

- Xây dựng trang chủ bán hàng cho một loại sản phẩm cụ thể: giày Sneaker.
- Hiển thị thông tin khuyến mãi, sản phẩm mới nhất và sản phẩm bán chạy nhất.
- Hiển thị thông tin thành viên sau khi đăng nhập thành công.
- Xây dựng chức năng đăng xuất tài khoản.
- Xây dựng trang danh sách sản phẩm có tìm kiếm và lọc dữ liệu theo nhiều điều kiện.
- Xây dựng trang chi tiết sản phẩm có nhiều hình ảnh, swiper, tồn kho, số lượng đã bán, chọn size, chọn màu và tăng giảm số lượng.
- Hiển thị sản phẩm tương tự thuộc cùng danh mục.
- Tích hợp frontend ReactJS với backend ExpressJS thông qua Axios.
- Sử dụng Tailwind CSS để xây dựng giao diện hiện đại, responsive và phù hợp với website bán hàng.

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
- React Router DOM
- Axios
- Tailwind CSS
- Swiper
- Lucide React
- LocalStorage

---

## 4. Chức năng đã thực hiện

### 4.1. Chức năng xác thực người dùng

Ứng dụng kế thừa chức năng xác thực từ bài tuần 03, bao gồm:

- Đăng ký tài khoản.
- Đăng nhập tài khoản.
- Lưu token đăng nhập vào LocalStorage.
- Gửi token qua Axios khi gọi API.
- Lấy thông tin người dùng hiện tại.
- Hiển thị thông tin thành viên đang đăng nhập.
- Đăng xuất tài khoản.

Sau khi người dùng đăng nhập thành công, hệ thống chuyển hướng đến trang chủ bán hàng.

---

### 4.2. Chức năng trang chủ bán hàng

Trang chủ Sneaker Shop gồm các nội dung chính:

- Thanh điều hướng với tên website SneakerHub.
- Hiển thị thông tin người dùng đang đăng nhập.
- Nút Logout để đăng xuất.
- Banner giới thiệu chương trình khuyến mãi.
- Khu vực thống kê nhanh.
- Danh sách sản phẩm khuyến mãi.
- Danh sách sản phẩm mới nhất.
- Danh sách sản phẩm bán chạy nhất.

Giao diện trang chủ được xây dựng bằng Tailwind CSS với bố cục hiện đại, có hiệu ứng hover, bo góc, đổ bóng và responsive trên nhiều kích thước màn hình.

---

### 4.3. Chức năng danh sách sản phẩm

Trang danh sách sản phẩm cho phép người dùng xem toàn bộ sản phẩm Sneaker trong hệ thống.

Các chức năng chính:

- Hiển thị danh sách sản phẩm dạng lưới.
- Tìm kiếm sản phẩm theo tên.
- Lọc theo danh mục.
- Lọc theo thương hiệu.
- Lọc theo khoảng giá.
- Lọc theo size.
- Lọc theo màu sắc.
- Lọc sản phẩm còn hàng.
- Sắp xếp sản phẩm theo:
  - Mới nhất
  - Giá tăng dần
  - Giá giảm dần
  - Bán chạy nhất
- Hiển thị trạng thái loading khi đang tải dữ liệu.
- Hiển thị thông báo khi không tìm thấy sản phẩm phù hợp.

---

### 4.4. Chức năng chi tiết sản phẩm

Trang chi tiết sản phẩm hiển thị đầy đủ thông tin của một sản phẩm Sneaker.

Các thông tin và chức năng gồm:

- Hiển thị nhiều hình ảnh sản phẩm bằng Swiper.
- Hiển thị tên sản phẩm.
- Hiển thị thương hiệu.
- Hiển thị danh mục.
- Hiển thị giá gốc và giá khuyến mãi.
- Hiển thị đánh giá sản phẩm.
- Hiển thị số lượng đã bán.
- Hiển thị số lượng tồn kho.
- Hiển thị trạng thái còn hàng hoặc hết hàng.
- Chọn size sản phẩm.
- Chọn màu sản phẩm.
- Tăng giảm số lượng mua.
- Nút thêm vào giỏ hàng dạng demo.
- Hiển thị mô tả sản phẩm.
- Hiển thị sản phẩm tương tự cùng danh mục.

---

### 4.5. Chức năng quản lý sản phẩm phía backend

Backend cung cấp các API để frontend lấy dữ liệu sản phẩm.

Các nhóm API đã xây dựng:

- Lấy toàn bộ sản phẩm.
- Lấy sản phẩm theo bộ lọc.
- Lấy sản phẩm mới nhất.
- Lấy sản phẩm bán chạy nhất.
- Lấy sản phẩm khuyến mãi.
- Lấy chi tiết sản phẩm.
- Lấy sản phẩm tương tự.
- Seed dữ liệu mẫu cho Sneaker Shop.

---

## 5. Cấu trúc thư mục

```txt
Tuan04_sneaker_shop
│
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── database.js
│   │   │
│   │   ├── controllers
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── middleware
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models
│   │   │   ├── Product.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes
│   │   │   ├── authRoutes.js
│   │   │   └── productRoutes.js
│   │   │
│   │   ├── seed
│   │   │   └── productSeed.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
└── frontend
    ├── src
    │   ├── api
    │   │   ├── axiosClient.js
    │   │   └── productApi.js
    │   │
    │   ├── components
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductFilter.jsx
    │   │   ├── ProductImageSwiper.jsx
    │   │   ├── ProductSection.jsx
    │   │   ├── QuantitySelector.jsx
    │   │   └── ShopNavbar.jsx
    │   │
    │   ├── pages
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── ProductSearchPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   │
    │   ├── styles
    │   │   └── global.css
    │   │
    │   ├── utils
    │   │   └── shop.js
    │   │
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
