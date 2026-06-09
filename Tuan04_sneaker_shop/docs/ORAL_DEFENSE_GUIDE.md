# ORAL DEFENSE GUIDE - Sneaker Shop

## 1. Tổng quan project

Sneaker Shop là một project fullstack mô phỏng ứng dụng bán giày sneaker. Người dùng có thể đăng ký, đăng nhập, xem sản phẩm, tìm kiếm và lọc sản phẩm, thêm vào giỏ hàng, checkout theo hình thức COD, xem lịch sử đơn hàng và theo dõi trạng thái đơn hàng.

Đối tượng người dùng chính:

- `student`: người dùng mua hàng, xem hồ sơ, giỏ hàng, đơn hàng.
- `admin`: hiện mới có xác thực role và trang hồ sơ admin cơ bản, chưa có dashboard quản trị đơn hàng hoàn chỉnh.

Chức năng chính của project:

- Xác thực người dùng bằng `JWT`
- Đăng ký có `OTP email`
- Quản lý hồ sơ người dùng
- Xem danh sách sản phẩm, tìm kiếm, lọc, sắp xếp, phân trang
- Xem chi tiết sản phẩm và sản phẩm liên quan
- Giỏ hàng lưu trong `MongoDB`
- Thanh toán `COD`
- Lịch sử đơn hàng và theo dõi trạng thái đơn
- Hủy đơn trong 30 phút hoặc gửi yêu cầu hủy nếu đơn đang `preparing`

## 2. Tech stack

### Frontend

- `React`: xây dựng UI theo component
- `Vite`: chạy dev server và build frontend
- `Axios`: gửi HTTP request tới backend
- `React Router`: điều hướng trang và route guard
- `Tailwind CSS`: styling bằng utility class
- `Ant Design`: icon và `message`
- `Swiper`: slider ảnh sản phẩm

### Backend

- `Node.js`: môi trường chạy server
- `Express`: xây dựng REST API
- `MongoDB`: database chính
- `Mongoose`: định nghĩa schema và thao tác MongoDB
- `JWT`: xác thực người dùng
- `bcrypt`: hash password
- `dotenv`: đọc biến môi trường
- `CORS`: cho phép frontend gọi backend khác origin
- `nodemailer`: gửi OTP qua email
- `express-rate-limit`: giới hạn số lần gọi API auth

## 3. Sơ đồ luồng request tổng quát

```txt
Người dùng thao tác trên UI
-> React Page / Component
-> file trong frontend/src/api gọi axiosClient
-> axiosClient gắn JWT từ localStorage nếu có
-> request tới Express route /api/...
-> middleware (rate limit / validation / protect / authorize)
-> controller
-> service
-> model Mongoose
-> MongoDB
-> service trả dữ liệu
-> controller trả JSON cho frontend
-> frontend setState / navigate / message
-> UI render lại
```

Sơ đồ ngắn cho auth:

```txt
RegisterPage / LoginPage
-> authApi
-> /api/auth/...
-> authRoutes
-> authController
-> authService
-> User model
-> MongoDB
-> JSON + token/redirectUrl
-> localStorage + điều hướng
```

Sơ đồ ngắn cho mua hàng:

```txt
ProductDetailPage
-> cartApi.addToCart
-> /api/cart/items
-> Cart service lưu MongoDB

CartPage -> CheckoutPage
-> orderApi.checkout
-> /api/orders/checkout
-> Order service tạo đơn + trừ stock + xóa cart
-> MongoDB
-> trả order mới
-> chuyển sang OrderDetailPage
```

## 4. Cấu trúc backend

### `backend/src/server.js`

File khởi động backend:

- `require('dotenv').config()` để nạp biến môi trường
- `connectDatabase()` để kết nối MongoDB
- `app.use(cors())`
- `app.use(express.json())`
- mount các route:
  - `/api/auth`
  - `/api/products`
  - `/api/cart`
  - `/api/orders`
- chạy job auto confirm đơn hàng qua `startOrderAutoConfirmJob()`

### `backend/src/routes`

Nơi khai báo endpoint:

- `authRoutes.js`: register, OTP, login, `/me`, forgot/reset password
- `productRoutes.js`: list, categories, detail, related, top products
- `cartRoutes.js`: giỏ hàng
- `orderRoutes.js`: checkout, lịch sử đơn, chi tiết đơn, hủy đơn, update status

### `backend/src/controllers`

Controller nhận `req`, `res`, gọi service rồi trả JSON.

Ví dụ:

- `authController.js`: xử lý response cho auth
- `productController.js`: trả list/detail product
- `cartController.js`: trả dữ liệu giỏ hàng
- `orderController.js`: trả dữ liệu checkout và đơn hàng
- `userController.js`: `/auth/me`

Controller không chứa business logic nặng, chỉ đóng vai trò trung gian.

### `backend/src/services`

Đây là lớp chứa business logic chính.

- `authService.js`
  - kiểm tra dữ liệu đăng ký/đăng nhập
  - tạo JWT
  - tạo OTP, hash OTP, verify OTP
  - gửi email OTP
- `userService.js`
  - lấy user hiện tại
  - cập nhật hồ sơ
- `productService.js`
  - build query filter
  - sort
  - phân trang
  - tăng `views` khi xem chi tiết
- `cartService.js`
  - tạo giỏ hàng nếu chưa có
  - thêm/cập nhật/xóa item
  - tính `subtotal`, `totalItems`
  - đồng bộ snapshot giá/tồn kho
- `orderService.js`
  - checkout COD
  - tạo order
  - trừ/hoàn stock
  - lấy lịch sử đơn
  - hủy đơn
  - cập nhật trạng thái đơn
- `orderAutoConfirmService.js`
  - cứ 5 phút kiểm tra đơn `new` quá 30 phút để tự chuyển sang `confirmed`
- `emailService.js`
  - gửi OTP email verification và reset password

### `backend/src/models`

Schema Mongoose:

- `User.js`: người dùng, password hash, role, OTP, trạng thái email verified
- `Product.js`: sản phẩm, slug, giá, stock, sold, views, size, color
- `Cart.js`: giỏ hàng theo user, item snapshot
- `Order.js`: đơn hàng, địa chỉ giao, payment COD, pricing, status, statusHistory, cancelInfo

### `backend/src/middleware`

- `authMiddleware.js`
  - `protect`: đọc JWT từ `Authorization: Bearer ...`
  - `authorize`: kiểm tra role
- `validationMiddleware.js`
  - validate request cho register, login, cart, checkout, cancel order...
- `rateLimitMiddleware.js`
  - chống spam auth API

### `backend/src/config`

- `database.js`: kết nối MongoDB bằng Mongoose
- `mail.js`: tạo transporter cho nodemailer

### `backend/src/seed`

- `productSeed.js`: seed dữ liệu sản phẩm mẫu vào MongoDB

### `backend/src/scripts`

- `backfillEmailVerification.js`: backfill dữ liệu user cũ sang field `isEmailVerified`

### `backend/src/utils`

- `generateOtp.js`: tạo OTP 6 số
- `hashOtp.js`: hash OTP bằng `sha256` và so sánh bằng `timingSafeEqual`

## 5. Cấu trúc frontend

### `frontend/src/api`

Lớp gọi API tập trung:

- `axiosClient.js`
  - cấu hình `baseURL`
  - gắn JWT vào header qua interceptor
  - dịch message backend sang tiếng Việt
- `authApi.js`
  - login, register, verify OTP, getCurrentUser, updateProfile...
  - quản lý `localStorage`
- `productApi.js`
  - gọi product endpoints
- `cartApi.js`
  - gọi cart endpoints
- `orderApi.js`
  - gọi order endpoints

### `frontend/src/components`

- `common`
  - `Loading`, `ErrorMessage`, `EmptyState`, `QuantitySelector`
- `layout`
  - `Navbar`, `Footer`, `MainLayout`
- `products`
  - `ProductCard`
  - `ProductFilter`
  - `ProductSection`
  - `HorizontalProductCarousel`
  - `ProductImageSwiper`
  - `CategoryProductSection`

### `frontend/src/pages`

Các trang chính:

- `HomePage.jsx`
- `RegisterPage.jsx`
- `LoginPage.jsx`
- `VerifyEmailPage.jsx` và alias `VerifyOtpPage.jsx`
- `ProfilePage.jsx`
- `AdminProfilePage.jsx`
- `ProductSearchPage.jsx`
- `ProductDetailPage.jsx`
- `CategoryProductsPage.jsx`
- `CartPage.jsx`
- `CheckoutPage.jsx`
- `OrderHistoryPage.jsx`
- `OrderDetailPage.jsx`

### `frontend/src/routes`

- `AppRoutes.jsx`: khai báo route
- `ProtectedRoute.jsx`: chặn route nếu chưa login hoặc sai role

### `frontend/src/utils`

- `shop.js`
  - `extractApiData`
  - format trạng thái đơn
  - format ngày giờ
  - tính deadline hủy đơn
  - helper cho product
- `messages.js`
  - map message backend sang tiếng Việt
- `formatCurrency.js`
  - format tiền tệ

## 6. Phân tích thư mục `docs`

- `API_DOCUMENTATION.md`: mô tả tổng quan endpoint backend
- `API_TESTING_GUIDE.md`: hướng dẫn test API theo thứ tự
- `AUTH_REQUIREMENTS_CHECKLIST.md`: checklist yêu cầu auth đã làm
- `FRONTEND_AUTH_TESTING_GUIDE.md`: cách test UI auth
- `CART_ORDER_API_GUIDE.md`: mô tả API giỏ hàng và đơn hàng chi tiết hơn
- `DATABASE_DESIGN.md`: mô tả collection và field chính
- `ROADMAP.md`: lộ trình dự án

Lưu ý khi vấn đáp:

- `ROADMAP.md` còn một vài mục cũ, vì hiện tại cart/order đã được code xong.
- `API_DOCUMENTATION.md` có đoạn mô tả auth chưa hoàn toàn đồng bộ với code mới.
- Khi thầy hỏi, nên ưu tiên trả lời theo `code hiện tại` hơn là theo docs cũ.

## 7. Luồng trạng thái đơn hàng

Các trạng thái đang có trong code:

- `new`
- `confirmed`
- `preparing`
- `shipping`
- `delivered`
- `cancelled`
- `cancel_requested`

Sơ đồ trạng thái:

```txt
new
-> confirmed (admin hoặc hệ thống tự xác nhận sau 30 phút)
-> preparing
-> shipping
-> delivered

new/confirmed + user hủy trong 30 phút
-> cancelled

preparing + user yêu cầu hủy
-> cancel_requested
```

Luồng auto confirm:

```txt
server.js
-> startOrderAutoConfirmJob()
-> mỗi 5 phút gọi autoConfirmEligibleOrders()
-> đơn status = new và createdAt quá 30 phút
-> update sang confirmed
-> ghi thêm statusHistory changedBy = system
```

## 8. Phân tích chi tiết từng luồng

### 8.1 Đăng ký

- UI:
  - User vào `/register`
  - nhập `fullName`, `email`, `studentId`, `password`
  - submit form
  - sau đó chuyển sang `/verify-otp` để nhập OTP
- Frontend gọi file nào:
  - `frontend/src/pages/RegisterPage.jsx`
  - `frontend/src/pages/VerifyEmailPage.jsx`
  - `frontend/src/api/authApi.js`
  - `frontend/src/api/axiosClient.js`
- API endpoint:
  - `POST /api/auth/register`
  - `POST /api/auth/verify-register-otp`
  - `POST /api/auth/resend-register-otp`
- Backend xử lý:
  - route: `backend/src/routes/authRoutes.js`
  - middleware: `registerLimiter`, `validateRegister`, `otpLimiter`, `validateVerifyOtp`
  - controller: `authController.register`, `authController.verifyRegisterOtp`
  - service: `authService.register`, `authService.verifyRegisterOtp`, `authService.resendRegisterOtp`
  - model: `User.js`
  - hỗ trợ: `emailService.js`, `generateOtp.js`, `hashOtp.js`
- Database thay đổi:
  - bước register:
    - tạo document user mới
    - password được hash bằng `bcrypt` trong `User` model
    - lưu `isEmailVerified = false`
    - lưu `emailVerificationOtp` đã hash
    - lưu `emailVerificationOtpExpires`
  - bước verify OTP:
    - cập nhật `isEmailVerified = true`
    - xóa `emailVerificationOtp`, `emailVerificationOtpExpires`
- Response trả về frontend:
  - register: trả `success`, `message`, `data.user`
  - verify OTP: trả `token`, `redirectUrl`, `data.user`
- Flow text:

```txt
RegisterPage
-> authApi.register()
-> POST /api/auth/register
-> validateRegister + rate limit
-> authController.register
-> authService.register
-> User.save() + sendVerificationOtpEmail()
-> frontend navigate('/verify-otp')
-> authApi.verifyRegisterOtp()
-> POST /api/auth/verify-register-otp
-> authService.verifyRegisterOtp
-> update User verified + create JWT
-> frontend lưu localStorage và chuyển vào profile
```

### 8.2 Đăng nhập

- UI:
  - User vào `/login`
  - nhập email và password
  - submit form
- Frontend gọi file nào:
  - `frontend/src/pages/LoginPage.jsx`
  - `frontend/src/api/authApi.js`
  - `frontend/src/api/axiosClient.js`
- API endpoint:
  - `POST /api/auth/login`
- Backend xử lý:
  - route: `authRoutes.js`
  - middleware: `loginLimiter`, `validateLogin`
  - controller: `authController.login`
  - service: `authService.login`
  - model: `User.js`
- Database thay đổi:
  - bình thường không đổi dữ liệu
  - chỉ có thể sync lại `isEmailVerified` cho dữ liệu legacy nếu thiếu field
- Response trả về frontend:
  - `token`
  - `redirectUrl`
  - `data.user`
- Flow text:

```txt
LoginPage
-> authApi.login()
-> POST /api/auth/login
-> validateLogin + rate limit
-> authController.login
-> authService.login
-> User.findOne() + comparePassword()
-> trả JWT
-> frontend lưu token/user vào localStorage
-> điều hướng theo role
```

### 8.3 Lấy thông tin user hiện tại

- UI:
  - User mở `/user/profile` hoặc `/admin/profile`
- Frontend gọi file nào:
  - `frontend/src/pages/ProfilePage.jsx`
  - `frontend/src/pages/AdminProfilePage.jsx`
  - `frontend/src/api/authApi.js`
- API endpoint:
  - `GET /api/auth/me`
- Backend xử lý:
  - route: `authRoutes.js`
  - middleware: `protect`
  - controller: `userController.getCurrentUser`
  - service: `userService.getCurrentUser`
  - model: `User.js`
- Database thay đổi:
  - thường không thay đổi
  - có thể sync dữ liệu email verification legacy nếu thiếu field
- Response trả về frontend:
  - `data.user`
- Flow text:

```txt
ProfilePage / AdminProfilePage
-> authApi.getCurrentUser()
-> GET /api/auth/me
-> protect đọc JWT
-> userController.getCurrentUser
-> userService.getCurrentUser
-> trả user đã sanitize
-> frontend render hồ sơ
```

### 8.4 Xem danh sách sản phẩm

- UI:
  - User mở trang chủ `/`
  - hoặc mở trang `/products`
- Frontend gọi file nào:
  - `frontend/src/pages/HomePage.jsx`
  - `frontend/src/pages/ProductSearchPage.jsx`
  - `frontend/src/api/productApi.js`
  - `frontend/src/components/products/ProductSection.jsx`
  - `frontend/src/components/products/HorizontalProductCarousel.jsx`
- API endpoint:
  - `GET /api/products`
  - `GET /api/products/new`
  - `GET /api/products/best-seller`
  - `GET /api/products/promotions`
  - `GET /api/products/top/best-sellers`
  - `GET /api/products/top/most-viewed`
- Backend xử lý:
  - route: `productRoutes.js`
  - controller: `productController.*`
  - service: `productService.getProducts`, `getNewProducts`, `getBestSellerProducts`, `getPromotionProducts`, `getTopBestSellers`, `getTopMostViewed`
  - model: `Product.js`
- Database thay đổi:
  - không đổi dữ liệu
- Response trả về frontend:
  - hoặc là mảng sản phẩm
  - hoặc object `{ products, pagination }`
- Flow text:

```txt
HomePage / ProductSearchPage
-> productApi.get...
-> GET /api/products...
-> productController
-> productService query Product
-> MongoDB trả danh sách
-> frontend render card sản phẩm
```

### 8.5 Tìm kiếm / lọc / sắp xếp / phân trang sản phẩm

- UI:
  - User ở `/products`
  - nhập từ khóa, chọn category, brand, size, color, giá
  - chọn sort và bấm áp dụng
  - chuyển trang bằng nút `Trước / Tiếp`
- Frontend gọi file nào:
  - `frontend/src/pages/ProductSearchPage.jsx`
  - `frontend/src/components/products/ProductFilter.jsx`
  - `frontend/src/api/productApi.js`
  - `frontend/src/utils/shop.js`
- API endpoint:
  - `GET /api/products?keyword=&category=&brand=&minPrice=&maxPrice=&size=&color=&sort=&page=&limit=`
- Backend xử lý:
  - route: `productRoutes.js`
  - controller: `productController.getProducts`
  - service:
    - `buildProductQuery()`
    - `buildProductSort()`
    - `getProducts()`
  - model: `Product.js`
- Database thay đổi:
  - không đổi dữ liệu
- Response trả về frontend:
  - `data.products`
  - `data.pagination.page`
  - `data.pagination.totalPages`
  - `data.pagination.hasNextPage`
  - `data.pagination.hasPrevPage`
- Flow text:

```txt
ProductFilter
-> set URLSearchParams
-> ProductSearchPage đọc query string
-> productApi.getProducts(params)
-> GET /api/products
-> productService build query + sort + skip + limit
-> MongoDB trả products + countDocuments
-> frontend render kết quả và phân trang
```

### 8.6 Xem chi tiết sản phẩm

- UI:
  - User bấm vào card sản phẩm hoặc nút `Xem chi tiết`
- Frontend gọi file nào:
  - `frontend/src/pages/ProductDetailPage.jsx`
  - `frontend/src/api/productApi.js`
  - `frontend/src/components/products/ProductImageSwiper.jsx`
  - `frontend/src/components/products/ProductSection.jsx`
- API endpoint:
  - `GET /api/products/:identifier`
  - `GET /api/products/:identifier/related`
- Backend xử lý:
  - route: `productRoutes.js`
  - controller: `productController.getProductById`, `getRelatedProducts`
  - service: `productService.getProductById`, `getRelatedProducts`
  - model: `Product.js`
- Database thay đổi:
  - `views` của sản phẩm tăng thêm 1 khi gọi `GET /products/:identifier` thành công
- Response trả về frontend:
  - product detail
  - danh sách related products
- Flow text:

```txt
ProductDetailPage
-> productApi.getProductById(productId)
-> GET /api/products/:id
-> productService.getProductById
-> Product.findOneAndUpdate(... $inc views: 1)

ProductDetailPage
-> productApi.getRelatedProducts(productId)
-> GET /api/products/:id/related
-> productService.getRelatedProducts
-> trả tối đa 4 sản phẩm cùng category
```

### 8.7 Thêm vào giỏ hàng

- UI:
  - User ở `ProductDetailPage`
  - chọn size, color, quantity
  - bấm `Thêm vào giỏ hàng`
- Frontend gọi file nào:
  - `frontend/src/pages/ProductDetailPage.jsx`
  - `frontend/src/api/cartApi.js`
  - `frontend/src/components/common/QuantitySelector.jsx`
- API endpoint:
  - `POST /api/cart/items`
- Backend xử lý:
  - route: `cartRoutes.js`
  - middleware: `protect`, `validateAddToCart`
  - controller: `cartController.addToCart`
  - service: `cartService.addToCart`
  - model: `Cart.js`, `Product.js`
- Database thay đổi:
  - nếu user chưa có cart thì tạo cart mới
  - nếu đã có cùng `product + size + color` thì tăng quantity
  - lưu snapshot `name`, `image`, `price`, `stockSnapshot`
  - cập nhật `totalItems`, `subtotal`
- Response trả về frontend:
  - `data.cart`
- Flow text:

```txt
ProductDetailPage
-> cartApi.addToCart({ productId, size, color, quantity })
-> POST /api/cart/items
-> protect + validateAddToCart
-> cartController.addToCart
-> cartService.addToCart
-> ensureCart() + validateProductAvailability()
-> Cart.save()
-> trả cart mới
-> frontend navigate('/cart')
```

### 8.8 Cập nhật / xóa giỏ hàng

- UI:
  - User vào `/cart`
  - bấm `+ / -` để đổi số lượng
  - bấm xóa từng item
  - hoặc xóa toàn bộ giỏ hàng
- Frontend gọi file nào:
  - `frontend/src/pages/CartPage.jsx`
  - `frontend/src/api/cartApi.js`
  - `frontend/src/components/common/QuantitySelector.jsx`
- API endpoint:
  - `GET /api/cart`
  - `PUT /api/cart/items/:itemId`
  - `DELETE /api/cart/items/:itemId`
  - `DELETE /api/cart`
- Backend xử lý:
  - route: `cartRoutes.js`
  - middleware: `protect`, `validateUpdateCartItem`
  - controller: `cartController.getMyCart`, `updateCartItem`, `removeCartItem`, `clearCart`
  - service: `cartService.getMyCart`, `updateCartItem`, `removeCartItem`, `clearCart`
  - model: `Cart.js`, `Product.js`
- Database thay đổi:
  - update quantity item
  - hoặc pull item khỏi mảng `items`
  - hoặc set `items = []`
  - luôn tính lại `subtotal`, `totalItems`
- Response trả về frontend:
  - mỗi thao tác đều trả `data.cart`
- Flow text:

```txt
CartPage load
-> cartApi.getCart()
-> GET /api/cart
-> cartService.getMyCart
-> syncCartSnapshots()
-> trả cart

CartPage đổi số lượng
-> cartApi.updateCartItem()
-> PUT /api/cart/items/:itemId
-> cartService.updateCartItem
-> Cart.save()

CartPage xóa item / clear cart
-> DELETE /api/cart/...
-> cartService.removeCartItem / clearCart
-> Cart.save()
```

### 8.9 Checkout COD

- UI:
  - User từ `CartPage` bấm `Tiến hành đặt hàng`
  - sang `CheckoutPage`
  - nhập địa chỉ giao hàng
  - bấm đặt hàng
- Frontend gọi file nào:
  - `frontend/src/pages/CheckoutPage.jsx`
  - `frontend/src/api/cartApi.js`
  - `frontend/src/api/orderApi.js`
- API endpoint:
  - `GET /api/cart`
  - `POST /api/orders/checkout`
- Backend xử lý:
  - route: `orderRoutes.js`
  - middleware: `protect`, `validateCheckout`
  - controller: `orderController.createOrderFromCart`
  - service: `orderService.createOrderFromCart`
  - model: `Cart.js`, `Order.js`, `Product.js`
- Database thay đổi:
  - đọc cart hiện tại
  - re-validate product tồn tại, active, đủ stock
  - trừ `stock`, tăng `sold` cho từng product
  - tạo document order mới
  - lưu `payment.method = COD`, `payment.status = unpaid`
  - lưu `status = new`
  - thêm `statusHistory` đầu tiên
  - xóa cart của user sau checkout
- Response trả về frontend:
  - `201`
  - `data.order`
- Flow text:

```txt
CheckoutPage
-> orderApi.checkout({ shippingAddress, paymentMethod: 'COD' })
-> POST /api/orders/checkout
-> protect + validateCheckout
-> orderController.createOrderFromCart
-> orderService.createOrderFromCart
-> đọc Cart -> validate Product -> reserve stock
-> Order.create()
-> clearUserCart()
-> trả order
-> frontend navigate('/orders/:orderId')
```

### 8.10 Xem lịch sử đơn hàng

- UI:
  - User vào `/orders`
- Frontend gọi file nào:
  - `frontend/src/pages/OrderHistoryPage.jsx`
  - `frontend/src/api/orderApi.js`
  - `frontend/src/utils/shop.js`
- API endpoint:
  - `GET /api/orders/my-orders`
- Backend xử lý:
  - route: `orderRoutes.js`
  - middleware: `protect`
  - controller: `orderController.getMyOrders`
  - service: `orderService.getMyOrders`
  - model: `Order.js`
- Database thay đổi:
  - không đổi dữ liệu
- Response trả về frontend:
  - `data.orders`
- Flow text:

```txt
OrderHistoryPage
-> orderApi.getMyOrders()
-> GET /api/orders/my-orders
-> protect
-> orderController.getMyOrders
-> orderService.getMyOrders
-> Order.find({ user }).sort({ createdAt: -1 })
-> trả danh sách orders
```

### 8.11 Xem chi tiết đơn hàng

- UI:
  - User bấm `Xem chi tiết` trong trang lịch sử đơn
- Frontend gọi file nào:
  - `frontend/src/pages/OrderDetailPage.jsx`
  - `frontend/src/api/orderApi.js`
  - `frontend/src/utils/shop.js`
- API endpoint:
  - `GET /api/orders/:orderId`
- Backend xử lý:
  - route: `orderRoutes.js`
  - middleware: `protect`
  - controller: `orderController.getMyOrderById`
  - service: `orderService.getMyOrderById`
  - model: `Order.js`
- Database thay đổi:
  - không đổi dữ liệu
- Response trả về frontend:
  - `data.order`
  - gồm `items`, `shippingAddress`, `payment`, `pricing`, `status`, `statusHistory`, `cancelInfo`
- Flow text:

```txt
OrderDetailPage
-> orderApi.getOrderById(orderId)
-> GET /api/orders/:orderId
-> protect
-> orderController.getMyOrderById
-> orderService.getMyOrderById
-> Order.findOne({ _id, user })
-> trả chi tiết order
```

### 8.12 Hủy đơn hàng trong 30 phút

- UI:
  - User vào `OrderDetailPage`
  - nếu đơn ở `new` hoặc `confirmed` và còn trong 30 phút thì nhập lý do, bấm `Hủy đơn hàng`
- Frontend gọi file nào:
  - `frontend/src/pages/OrderDetailPage.jsx`
  - `frontend/src/api/orderApi.js`
  - `frontend/src/utils/shop.js`
- API endpoint:
  - `PUT /api/orders/:orderId/cancel`
- Backend xử lý:
  - route: `orderRoutes.js`
  - middleware: `protect`, `validateCancelOrder`
  - controller: `orderController.cancelMyOrder`
  - service: `orderService.cancelMyOrder`
  - model: `Order.js`, `Product.js`
- Database thay đổi:
  - kiểm tra `createdAt + 30 phút`
  - nếu hợp lệ:
    - hoàn `stock`
    - giảm `sold`
    - `order.status = cancelled`
    - lưu `cancelInfo.reason`, `requestedAt`, `cancelledAt`
    - thêm `statusHistory`
- Response trả về frontend:
  - `data.order` mới sau khi hủy
- Flow text:

```txt
OrderDetailPage
-> orderApi.cancelOrder(orderId, { reason })
-> PUT /api/orders/:orderId/cancel
-> validateCancelOrder
-> orderController.cancelMyOrder
-> orderService.cancelMyOrder
-> check status + check 30 phút
-> restoreInventoryForOrderItems()
-> order.status = cancelled
-> save()
-> trả updated order
```

### 8.13 Luồng `cancel_requested` khi đơn đang `preparing`

- UI:
  - User vào `OrderDetailPage`
  - nếu đơn đang `preparing`, UI không cho hủy trực tiếp mà hiện nút `Gửi yêu cầu hủy đơn`
- Frontend gọi file nào:
  - `frontend/src/pages/OrderDetailPage.jsx`
  - `frontend/src/api/orderApi.js`
- API endpoint:
  - `PUT /api/orders/:orderId/cancel`
- Backend xử lý:
  - route: `orderRoutes.js`
  - middleware: `protect`, `validateCancelOrder`
  - controller: `orderController.cancelMyOrder`
  - service: `orderService.cancelMyOrder`
  - model: `Order.js`
- Database thay đổi:
  - không hoàn stock ngay
  - `order.status = cancel_requested`
  - lưu `cancelInfo.reason`
  - lưu `cancelInfo.requestedAt`
  - thêm `statusHistory` với note `Cancellation request sent to shop`
- Response trả về frontend:
  - message báo gửi yêu cầu thành công
  - `data.order` mới với status `cancel_requested`
- Flow text:

```txt
OrderDetailPage
-> orderApi.cancelOrder(orderId, { reason })
-> PUT /api/orders/:orderId/cancel
-> orderService.cancelMyOrder
-> nếu status === preparing
-> set status = cancel_requested
-> save()
-> frontend render trạng thái chờ shop xử lý
```

## 9. Bản đồ nhanh các endpoint quan trọng

### Public

- `POST /api/auth/register`
- `POST /api/auth/verify-register-otp`
- `POST /api/auth/resend-register-otp`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/products`
- `GET /api/products/categories`
- `GET /api/products/new`
- `GET /api/products/best-seller`
- `GET /api/products/promotions`
- `GET /api/products/top/best-sellers`
- `GET /api/products/top/most-viewed`
- `GET /api/products/:identifier`
- `GET /api/products/:identifier/related`

### Protected

- `GET /api/auth/me`
- `PUT /api/auth/me`
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `DELETE /api/cart`
- `POST /api/orders/checkout`
- `GET /api/orders/my-orders`
- `GET /api/orders/:orderId`
- `PUT /api/orders/:orderId/cancel`

### Admin only

- `PUT /api/orders/:orderId/status`

## 10. 50 câu hỏi vấn đáp có thể gặp

### 1. Project này làm gì?

Đây là web bán sneaker fullstack, hỗ trợ auth, xem sản phẩm, giỏ hàng, checkout COD và theo dõi đơn hàng.

### 2. Đối tượng người dùng của project là ai?

Có 2 nhóm chính: `student` là người mua hàng và `admin` là quản trị viên.

### 3. Frontend dùng công nghệ gì?

Frontend dùng `React`, `Vite`, `Axios`, `React Router`, `Tailwind CSS`, `Ant Design`, `Swiper`.

### 4. Backend dùng công nghệ gì?

Backend dùng `Node.js`, `Express`, `MongoDB`, `Mongoose`, `JWT`, `bcrypt`, `dotenv`, `CORS`.

### 5. Tại sao tách `routes - controllers - services - models`?

Để tách rõ vai trò: route nhận endpoint, controller xử lý req/res, service chứa business logic, model thao tác database.

### 6. `server.js` làm nhiệm vụ gì?

Khởi tạo Express app, kết nối MongoDB, mount routes, bật CORS, parse JSON và start server.

### 7. JWT được dùng ở đâu?

JWT được tạo sau đăng nhập hoặc verify OTP, lưu ở frontend và gửi lại trong header `Authorization`.

### 8. `bcrypt` được dùng ở đâu?

`bcrypt` dùng trong `User` model để hash password trước khi lưu vào MongoDB.

### 9. Tại sao password không lưu plain text?

Vì lưu plain text rất nguy hiểm, bị lộ database là lộ toàn bộ mật khẩu người dùng.

### 10. OTP trong project dùng để làm gì?

OTP dùng để xác thực email khi đăng ký và để reset password.

### 11. OTP có được lưu trực tiếp trong database không?

Không. OTP được hash bằng `sha256` rồi mới lưu.

### 12. Vì sao có `rate limit`?

Để chống spam và brute force vào các API auth như login, register, verify OTP.

### 13. Middleware `protect` làm gì?

Nó lấy JWT từ header, verify token và gắn user hiện tại vào `req.user`.

### 14. Middleware `authorize` làm gì?

Kiểm tra role của user, ví dụ chỉ `admin` mới được cập nhật trạng thái đơn hàng qua API admin.

### 15. Collection `users` lưu gì?

Lưu thông tin tài khoản như họ tên, email, mã sinh viên, password hash, role, OTP và trạng thái xác thực email.

### 16. Collection `products` lưu gì?

Lưu thông tin catalog sản phẩm như tên, slug, giá, tồn kho, lượt xem, size, color, flags khuyến mãi.

### 17. Collection `carts` lưu gì?

Lưu 1 giỏ hàng cho mỗi user, gồm danh sách item và tổng tiền tạm tính.

### 18. Collection `orders` lưu gì?

Lưu snapshot sản phẩm đã mua, địa chỉ giao hàng, payment, pricing, trạng thái đơn và lịch sử trạng thái.

### 19. Vì sao giỏ hàng lưu bằng database thay vì Redis?

Đề bài cho phép dùng Redis hoặc database. Project này chọn MongoDB để đơn giản triển khai và dữ liệu cart vẫn được lưu bền vững.

### 20. Frontend gắn token vào request bằng cách nào?

Qua `axiosClient` interceptor, đọc token từ `localStorage` và thêm vào header `Authorization`.

### 21. Sau khi login, frontend lưu gì?

Frontend lưu `token` và `user` vào `localStorage`.

### 22. Route nào dùng để lấy user hiện tại?

`GET /api/auth/me`.

### 23. Trang nào gọi `GET /auth/me`?

`ProfilePage.jsx` và `AdminProfilePage.jsx`.

### 24. Tìm kiếm sản phẩm được thực hiện thế nào?

Frontend gửi query params lên `GET /api/products`, backend build query MongoDB theo keyword và các bộ lọc.

### 25. Sắp xếp sản phẩm được làm thế nào?

Backend map `sort` sang object sort của MongoDB như `price_asc`, `price_desc`, `best_seller`, `most_viewed`.

### 26. Phân trang sản phẩm làm thế nào?

Backend dùng `page`, `limit`, tính `skip`, rồi trả thêm object `pagination`.

### 27. Xem chi tiết sản phẩm có làm thay đổi dữ liệu không?

Có. Mỗi lần xem chi tiết, backend tăng `views` của sản phẩm lên 1.

### 28. Sản phẩm liên quan lấy theo tiêu chí nào?

Lấy sản phẩm cùng `category`, khác `_id`, và còn `status = active`.

### 29. Khi thêm vào giỏ hàng, backend kiểm tra gì?

Kiểm tra product có tồn tại không, còn active không, size/color hợp lệ không và quantity có vượt stock không.

### 30. Vì sao cart item lưu `stockSnapshot`?

Để frontend biết ngay item nào đang hết hàng hoặc không đủ tồn kho khi user quay lại giỏ hàng.

### 31. Tại sao cart lưu snapshot `name`, `image`, `price`?

Để hiển thị nhanh trên UI và giữ thông tin sản phẩm tại thời điểm đưa vào giỏ.

### 32. Checkout hiện hỗ trợ phương thức nào?

Hiện chỉ hỗ trợ `COD`.

### 33. Ở backend, chỗ nào ép payment method là COD?

Trong `validateCheckout` và thêm một lần kiểm tra trong `orderService.createOrderFromCart`.

### 34. Checkout làm thay đổi database như thế nào?

Tạo order mới, trừ stock sản phẩm, tăng sold và xóa cart của user.

### 35. Vì sao cần validate lại stock khi checkout dù đã có cart?

Vì stock có thể thay đổi sau lúc user thêm vào giỏ hàng, nên checkout phải kiểm tra lại để tránh oversell.

### 36. `statusHistory` dùng để làm gì?

Để lưu timeline trạng thái đơn hàng, giúp người dùng theo dõi lịch sử thay đổi.

### 37. Đơn hàng mới có trạng thái ban đầu là gì?

Là `new`.

### 38. Khi nào đơn được tự chuyển sang `confirmed`?

Khi đơn còn ở `new` quá 30 phút và job nền chạy kiểm tra.

### 39. Job auto confirm chạy ở đâu?

Trong `orderAutoConfirmService.js`, được start từ `server.js`.

### 40. Job auto confirm chạy bao lâu một lần?

Mỗi 5 phút.

### 41. Người dùng có thể hủy đơn trong trường hợp nào?

Khi đơn đang ở `new` hoặc `confirmed` và vẫn còn trong 30 phút sau khi đặt.

### 42. Nếu đơn đang `preparing` thì sao?

Người dùng không hủy trực tiếp nữa, chỉ gửi yêu cầu hủy và đơn chuyển sang `cancel_requested`.

### 43. Khi hủy thành công, stock có được trả lại không?

Có. Backend cộng lại `stock` và giảm `sold`.

### 44. Khi `cancel_requested`, stock có trả lại ngay không?

Không. Vì shop chưa xác nhận hủy, nên chỉ đổi trạng thái đơn.

### 45. Trạng thái thanh toán của COD trong code là gì?

Mặc định là `unpaid`.

### 46. Frontend route nào được bảo vệ?

`/cart`, `/checkout`, `/orders`, `/orders/:orderId`, `/user/profile`, `/admin/profile`.

### 47. Vì sao dùng `slug` cho sản phẩm?

Để URL đẹp hơn và vẫn có thể fallback sang `_id` nếu cần.

### 48. Seed dùng để làm gì?

Để đổ dữ liệu sản phẩm mẫu vào MongoDB, giúp demo và test nhanh.

### 49. Điểm yếu hiện tại của luồng order là gì?

Chưa dùng MongoDB transaction thật sự, đang dùng rollback thủ công nếu reserve stock lỗi.

### 50. Nếu thầy hỏi “docs khác code thì tin cái nào” trả lời sao?

Em sẽ ưu tiên theo code hiện tại vì code là nguồn sự thật chạy thật; một số file docs trong repo chỉ chưa được cập nhật kịp.

## 11. Những điểm hạn chế và hướng phát triển

### Hạn chế hiện tại

- Mới chỉ hỗ trợ `COD`, chưa có MoMo, ZaloPay, VNPay...
- Chưa có màn hình admin quản lý đơn hàng hoàn chỉnh, dù backend đã có API `PUT /orders/:orderId/status`
- Chưa có test tự động cho frontend và backend
- Chưa dùng transaction MongoDB cho checkout/cancel order
- Token đang lưu ở `localStorage`, đơn giản nhưng chưa tối ưu bảo mật bằng `HttpOnly cookie`
- Dự án hiện chủ yếu chạy local, chưa có cấu hình deploy/CI/CD
- Một vài file `docs` chưa cập nhật hoàn toàn theo code mới

### Hướng phát triển

- Tích hợp thanh toán online như MoMo hoặc ZaloPay
- Làm dashboard admin để duyệt và cập nhật trạng thái đơn
- Viết unit test và integration test
- Dùng MongoDB transaction cho luồng order
- Thêm review/rating thật cho sản phẩm
- Thêm wishlist/favorites
- Thêm deploy bằng Docker hoặc cloud
- Nếu cần scale thêm, có thể cân nhắc `Redis` cho cache hoặc session/cart

## 12. Cách học nhanh trước khi vấn đáp

Nên nhớ 4 trục chính:

1. `Kiến trúc`: route -> controller -> service -> model
2. `Auth`: register -> OTP -> login -> JWT -> protect
3. `Catalog`: products -> filter -> detail -> related
4. `Mua hàng`: cart -> checkout COD -> order history -> cancel

Nếu cần trả lời nhanh, chỉ cần nói theo mẫu:

```txt
Người dùng bấm ở page nào
-> frontend gọi file api nào
-> endpoint nào
-> backend route/controller/service nào xử lý
-> database đổi gì
-> frontend nhận response gì
```

Đó là khung trả lời an toàn, rõ và rất dễ ghi điểm khi vấn đáp.
