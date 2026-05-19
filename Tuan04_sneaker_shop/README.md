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