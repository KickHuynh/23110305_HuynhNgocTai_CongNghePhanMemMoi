# Tài liệu 137 câu vấn đáp liên hệ project Sneaker Shop

## Ghi nhớ nhanh dự án

- Project là web bán giày Sneaker theo mô hình fullstack tách `frontend` và `backend`.
- Frontend dùng `React`, `Vite`, `Axios`, `React Router`, `Tailwind CSS`.
- Backend dùng `Node.js`, `Express`, `MongoDB`, `Mongoose`, `JWT`, `bcrypt`, `dotenv`, `CORS`.
- Xác thực của project là: đăng ký -> gửi OTP email -> xác thực OTP -> nhận JWT -> gọi API kèm `Authorization: Bearer token`.
- Giỏ hàng của project đang lưu trong `MongoDB` qua model `Cart`, chưa dùng Redis.
- Thanh toán hiện tại chỉ hỗ trợ `COD`, chưa có ví điện tử hay cổng thanh toán online.
- Đơn hàng có các trạng thái: `new`, `confirmed`, `preparing`, `shipping`, `delivered`, `cancelled`, `cancel_requested`.
- Đơn `new` sẽ tự chuyển sang `confirmed` sau 30 phút nếu chưa được xác nhận thủ công.
- Người dùng được hủy trực tiếp trong 30 phút đầu nếu đơn đang `new` hoặc `confirmed`; nếu đơn đang `preparing` thì chỉ gửi `cancel_requested`.
- Project hiện chưa dùng `Redux`, `Zustand`, `RTK Query`, `Redis`, `Socket.IO`, `GraphQL`, `Docker`, `Refresh Token`.
- Khi trả lời vấn đáp, nên nói rõ chỗ nào là lý thuyết chung và chỗ nào project hiện tại có triển khai thật.

## Nhóm 1. Fullstack, ExpressJS, API, JWT, React cơ bản

### Câu 1. ExpressJS là gì?

Trả lời ngắn: ExpressJS là framework web chạy trên Node.js, giúp tạo server và REST API nhanh hơn so với dùng module `http` thuần. Nó hỗ trợ routing, middleware và tổ chức backend rõ ràng hơn.

Liên hệ project: Backend Sneaker Shop dùng Express để mở các API như `/api/auth`, `/api/products`, `/api/cart`, `/api/orders` trong `backend/src/server.js`.

### Câu 2. Middleware trong ExpressJS là gì?

Trả lời ngắn: Middleware là hàm nằm giữa request và response, có thể kiểm tra, xử lý hoặc chặn request trước khi vào controller. Middleware thường có dạng `(req, res, next)`.

Liên hệ project: Project dùng `cors()`, `express.json()`, rate limit, validation middleware, `protect` để kiểm tra JWT và `authorize` để phân quyền role.

### Câu 3. Sự khác nhau giữa app.use() và app.get()?

Trả lời ngắn: `app.use()` dùng để gắn middleware hoặc router cho nhiều method. `app.get()` chỉ xử lý request `GET` tại một đường dẫn cụ thể.

Liên hệ project: Trong `server.js`, project dùng `app.use('/api/auth', authRoutes)`. Bên trong router mới có các câu lệnh như `router.get('/me', protect, getCurrentUser)`.

### Câu 4. RESTful API là gì?

Trả lời ngắn: RESTful API là cách thiết kế API theo tài nguyên, dùng URL để biểu diễn tài nguyên và HTTP method để biểu diễn hành động. Mỗi request nên đủ thông tin để server xử lý.

Liên hệ project: Sneaker Shop có các tài nguyên chính là `auth`, `products`, `cart`, `orders`. Ví dụ `GET /api/products`, `POST /api/cart/items`, `POST /api/orders/checkout`.

### Câu 5. JWT là gì?

Trả lời ngắn: JWT là JSON Web Token, dùng để truyền thông tin xác thực giữa client và server. Token có chữ ký để server kiểm tra token có bị sửa hay không.

Liên hệ project: Backend tạo JWT trong `authService.createToken`. Token chỉ được trả sau khi `login` thành công hoặc `verify-register-otp` thành công, chứ không trả ngay khi vừa đăng ký.

### Câu 6. Nên lưu JWT ở đâu?

Trả lời ngắn: Với đồ án học tập, cách đơn giản là lưu access token trong `localStorage` rồi gắn vào header `Authorization`. Cách an toàn hơn trong production là dùng `HttpOnly Cookie` cho refresh token và access token sống ngắn.

Liên hệ project: Frontend Sneaker Shop đang lưu token trong `localStorage` qua `authApi.js`, sau đó `axiosClient` tự gắn `Bearer token` vào request.

### Câu 7. CORS là gì?

Trả lời ngắn: CORS là cơ chế cho phép hoặc chặn frontend ở một origin gọi tài nguyên ở origin khác. Nó không phải cơ chế xác thực người dùng.

Liên hệ project: Frontend chạy ở `localhost:5173`, backend thường chạy ở `localhost:5000`, nên backend bật `cors()` để frontend gọi API được.

### Câu 8. Event Loop trong Node.js là gì?

Trả lời ngắn: Event Loop là cơ chế giúp Node.js xử lý I/O bất đồng bộ mà không chặn luồng chính. Nhờ vậy Node phù hợp cho web API có nhiều request chờ database hoặc network.

Liên hệ project: Khi project gọi MongoDB, gửi email OTP hoặc trả dữ liệu sản phẩm, Node.js chủ yếu làm việc theo kiểu non-blocking I/O.

### Câu 9. ReactJS là gì?

Trả lời ngắn: ReactJS là thư viện JavaScript dùng để xây dựng giao diện theo component. Nó giúp tái sử dụng UI và cập nhật giao diện theo state/props.

Liên hệ project: Frontend Sneaker Shop dùng React để làm trang chủ, trang sản phẩm, chi tiết sản phẩm, giỏ hàng, checkout, lịch sử đơn hàng và hồ sơ người dùng.

### Câu 10. Virtual DOM là gì?

Trả lời ngắn: Virtual DOM là bản mô phỏng DOM thật trong bộ nhớ. Khi state thay đổi, React so sánh bản cũ và bản mới rồi chỉ cập nhật phần cần thiết lên DOM thật.

Liên hệ project: Nhờ Virtual DOM, các trang như giỏ hàng và danh sách sản phẩm cập nhật lại giao diện mượt hơn khi số lượng hoặc bộ lọc thay đổi.

### Câu 11. State và Props khác nhau thế nào?

Trả lời ngắn: `State` là dữ liệu nội bộ của component và component có thể tự cập nhật nó. `Props` là dữ liệu truyền từ component cha xuống component con và component con không nên tự sửa.

Liên hệ project: Ví dụ `ProductDetailPage` có state cho màu, size, số lượng; còn `ProductCard` thường nhận dữ liệu sản phẩm qua props từ component cha.

### Câu 12. useEffect dùng để làm gì?

Trả lời ngắn: `useEffect` dùng để xử lý side effect như gọi API, đăng ký sự kiện, thao tác DOM hoặc đồng bộ dữ liệu bên ngoài. Nó thường chạy sau khi component render.

Liên hệ project: Nhiều trang trong project dùng `useEffect` để gọi API, như `HomePage`, `ProductDetailPage`, `CartPage`, `OrderHistoryPage` và `OrderDetailPage`.

### Câu 13. Controlled Component là gì?

Trả lời ngắn: Controlled Component là form mà giá trị input được quản lý bởi React state. Mỗi lần người dùng nhập, `onChange` sẽ cập nhật state rồi state lại đổ ngược ra input.

Liên hệ project: Các form `Register`, `Login`, `Verify OTP`, `Forgot Password`, `Checkout` đều đang đi theo kiểu controlled component.

### Câu 14. Redux dùng để làm gì?

Trả lời ngắn: Redux là thư viện quản lý global state, phù hợp khi nhiều component ở nhiều tầng khác nhau cùng dùng chung một dữ liệu phức tạp. Nó có store, action, reducer và middleware.

Liên hệ project: Sneaker Shop hiện chưa dùng Redux vì phạm vi còn vừa phải. Project đang dùng local state, API module và `localStorage` cho token/user.

### Câu 15. Khác nhau giữa useMemo và useCallback?

Trả lời ngắn: `useMemo` ghi nhớ kết quả tính toán, còn `useCallback` ghi nhớ một function. Cả hai đều nhằm tránh tạo lại thứ không cần thiết khi re-render.

Liên hệ project: Project hiện chưa phụ thuộc nhiều vào hai hook này vì quy mô chưa lớn, nhưng có thể áp dụng sau này cho filter nặng hoặc danh sách lớn.

### Câu 16. React Router là gì?

Trả lời ngắn: React Router là thư viện điều hướng trong React, giúp xây SPA có nhiều route mà không reload cả trang. Nó hỗ trợ route tĩnh, route động và route bảo vệ.

Liên hệ project: Sneaker Shop dùng `AppRoutes.jsx` và `ProtectedRoute.jsx`. Các route động tiêu biểu là `/products/:productId` và `/orders/:orderId`.

### Câu 17. Axios khác fetch thế nào?

Trả lời ngắn: `fetch` là API có sẵn của trình duyệt, còn Axios là thư viện HTTP client. Axios tiện hơn ở chỗ có interceptor, cấu hình chung và xử lý lỗi/JSON gọn hơn.

Liên hệ project: Frontend dùng `axiosClient` để cấu hình `baseURL`, tự gắn JWT vào header và dịch message backend sang tiếng Việt.

### Câu 18. Authentication flow React + Express?

Trả lời ngắn: Flow cơ bản là frontend gửi thông tin đăng nhập, backend kiểm tra tài khoản, tạo token và trả token về; các request sau gửi kèm token để backend xác thực. Backend chịu trách nhiệm xác thực thật, frontend chịu trách nhiệm lưu token và điều hướng.

Liên hệ project: Với Sneaker Shop, flow thực tế là `register` -> gửi OTP email -> `verify-register-otp` -> nhận JWT. Khi login, frontend lưu token vào `localStorage`, rồi `protect` trong backend sẽ giải mã token ở các API cần đăng nhập.

### Câu 19. Xử lý upload file an toàn ExpressJS?

Trả lời ngắn: Thường dùng `Multer`, nhưng phải giới hạn dung lượng, kiểm tra MIME type, đổi tên file an toàn và không cho upload file thực thi nguy hiểm. Cũng cần kiểm tra quyền của người upload.

Liên hệ project: Sneaker Shop hiện chưa có chức năng upload ảnh hay tài liệu từ phía người dùng, nên chưa dùng `Multer`.

### Câu 20. SQL Injection và XSS là gì?

Trả lời ngắn: SQL Injection là tấn công chèn câu lệnh truy vấn độc hại; còn XSS là chèn script độc hại vào giao diện để đánh cắp token hoặc thao túng UI. Với MongoDB vẫn có nguy cơ NoSQL Injection nếu không validate input.

Liên hệ project: Project giảm rủi ro bằng validation middleware, dùng Mongoose thay vì nối chuỗi truy vấn thủ công, và React mặc định escape text khi render. Tuy nhiên token đang để trong `localStorage`, nên XSS vẫn là điểm cần lưu ý khi lên production.

### Câu 21. SSR và CSR khác nhau?

Trả lời ngắn: CSR là render giao diện chủ yếu ở client sau khi tải JavaScript; SSR là server render HTML trước rồi mới hydrate ở client. SSR thường mạnh hơn về SEO và tốc độ hiển thị ban đầu.

Liên hệ project: Sneaker Shop hiện là ứng dụng `CSR` vì frontend dùng React + Vite thông thường, không dùng Next.js hay cơ chế SSR.

### Câu 22. Vì sao React re-render?

Trả lời ngắn: React re-render khi state thay đổi, props thay đổi, context thay đổi hoặc component cha re-render. Re-render không có nghĩa là toàn bộ DOM thật bị vẽ lại vì React còn tối ưu bằng Virtual DOM.

Liên hệ project: Ví dụ ở `CartPage`, khi tăng giảm số lượng hoặc xóa item thì state thay đổi và trang re-render để cập nhật tổng tiền.

### Câu 23. ExpressJS có nhược điểm gì?

Trả lời ngắn: Express rất linh hoạt nhưng cũng rất tối giản, nên nhiều thứ như validation, error handling, security, logging và kiến trúc phải tự chuẩn hóa. Nếu nhóm không thống nhất thì code dễ lộn xộn.

Liên hệ project: Project khắc phục bằng cách tách rõ `routes`, `controllers`, `services`, `models`, `middleware`, thay vì viết dồn logic vào một nơi.

### Câu 24. MongoDB khác MySQL?

Trả lời ngắn: MongoDB là NoSQL document database, schema linh hoạt và dễ lưu dữ liệu lồng nhau. MySQL là relational database, dữ liệu dạng bảng và quan hệ chặt hơn.

Liên hệ project: Sneaker Shop chọn MongoDB vì sản phẩm, giỏ hàng và đơn hàng đều có cấu trúc document khá tự nhiên, ví dụ `Cart.items` và `Order.items`.

### Câu 25. Refresh Token là gì?

Trả lời ngắn: Refresh Token là token sống lâu hơn, dùng để xin access token mới khi access token hết hạn. Cách này giúp access token ngắn hạn hơn và giảm rủi ro.

Liên hệ project: Sneaker Shop hiện chưa triển khai refresh token. Project đang dùng một JWT duy nhất với `JWT_EXPIRES_IN`, đủ cho phạm vi đồ án.

### Câu 26. Bạn tối ưu React app như thế nào?

Trả lời ngắn: Có thể tối ưu bằng cách tách component hợp lý, tránh state đặt quá cao, phân trang, debounce tìm kiếm, cache dữ liệu và chỉ memoize khi thực sự cần. Tối ưu phải dựa trên nút thắt thật chứ không làm theo cảm tính.

Liên hệ project: Project đã có phân trang sản phẩm, tách nhiều component dùng lại và chia API module riêng. Hướng cải tiến tiếp theo là debounce search, lazy loading và cache server state.

### Câu 27. Bạn deploy React + Express như thế nào?

Trả lời ngắn: Cách phổ biến là deploy frontend React lên Vercel/Netlify, deploy backend Express lên Render/Railway/VPS và dùng MongoDB Atlas cho database. Sau đó cấu hình biến môi trường để frontend trỏ đúng backend.

Liên hệ project: Sneaker Shop hiện chủ yếu chạy local. Nếu deploy, frontend có thể dùng `VITE_API_URL`, backend cần `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.

### Câu 28. PM2 là gì?

Trả lời ngắn: PM2 là process manager cho Node.js, giúp chạy app nền, tự restart khi lỗi và quản lý log tốt hơn. Nó thường dùng khi deploy lên VPS.

Liên hệ project: Project hiện chưa deploy bằng PM2, nhưng nếu đưa backend Sneaker Shop lên VPS thì PM2 là lựa chọn phù hợp.

### Câu 29. Khác nhau giữa Authentication và Authorization?

Trả lời ngắn: Authentication là xác thực danh tính, tức “bạn là ai”. Authorization là phân quyền, tức “bạn được làm gì”.

Liên hệ project: Trong Sneaker Shop, đăng nhập bằng email/password + JWT là authentication. Kiểm tra role `student` hay `admin`, và chặn route bằng `authorize` hoặc `ProtectedRoute`, là authorization.

### Câu 30. Vì sao chọn React thay Angular/Vue?

Trả lời ngắn: React phổ biến, hệ sinh thái lớn, dễ chia nhỏ UI theo component và rất hợp với SPA dùng API backend riêng. Nó cũng linh hoạt, học liệu nhiều và dễ ghép với Vite, Axios, Router.

Liên hệ project: Với Sneaker Shop, React phù hợp vì frontend và backend tách riêng, cần gọi nhiều API, và giao diện gồm nhiều trang như sản phẩm, giỏ hàng, checkout, đơn hàng.

## Nhóm 2. React state management và re-render

### Câu 31. State trong React là gì?

Trả lời ngắn: State là dữ liệu nội bộ của component, và khi state đổi thì React sẽ cập nhật giao diện tương ứng. State thường dùng cho form, loading, error, dữ liệu nhận từ API hoặc trạng thái tương tác.

Liên hệ project: Project dùng state cho form đăng nhập/đăng ký, bộ lọc sản phẩm, dữ liệu giỏ hàng, chi tiết đơn hàng và trạng thái loading.

### Câu 32. Khác nhau giữa State và Props?

Trả lời ngắn: State là dữ liệu component tự quản lý và có thể cập nhật. Props là dữ liệu component cha truyền xuống để component con sử dụng.

Liên hệ project: Ở Sneaker Shop, page thường giữ state dữ liệu chính; còn các component con như card sản phẩm hoặc bộ chọn số lượng nhận dữ liệu qua props.

### Câu 33. useState hoạt động như thế nào?

Trả lời ngắn: `useState` trả về một cặp gồm giá trị hiện tại và hàm cập nhật. Khi gọi hàm cập nhật, React sẽ lên lịch render lại component với state mới.

Liên hệ project: Rất nhiều trang dùng `useState`, ví dụ `RegisterPage` giữ `formData`, `errorMessage`, `loading`, còn `OrderDetailPage` giữ `order`, `cancelReason`, `cancelSubmitting`.

### Câu 34. Vì sao setState bất đồng bộ?

Trả lời ngắn: React thường batch nhiều lần cập nhật state để tối ưu hiệu năng, nên không nên giả định vừa `setState` xong là đọc lại được giá trị mới ngay. Điều này giúp React giảm số lần render không cần thiết.

Liên hệ project: Khi xử lý form hoặc loading, project thường set state rồi để React render lại, thay vì phụ thuộc ngay vào giá trị vừa cập nhật trong cùng một dòng lệnh.

### Câu 35. Cách update state dựa trên state cũ?

Trả lời ngắn: Khi state mới phụ thuộc state cũ, nên dùng dạng hàm như `setState(prev => newValue)`. Cách này an toàn hơn khi React batch update.

Liên hệ project: `RegisterPage`, `LoginPage` và nhiều form khác trong project cập nhật object form bằng kiểu `setFormData(current => ({ ...current, [name]: value }))`.

### Câu 36. Lifting State Up là gì?

Trả lời ngắn: Lifting State Up là đưa state lên component cha gần nhất khi nhiều component con cùng cần dùng hoặc cùng phải cập nhật dữ liệu đó. Mục tiêu là có một nguồn dữ liệu chung.

Liên hệ project: Trong Sneaker Shop, state chính thường được giữ ở level page rồi truyền xuống component con, thay vì để từng component con tự giữ một bản dữ liệu riêng.

### Câu 37. Controlled Component là gì?

Trả lời ngắn: Controlled Component là form mà giá trị input đi theo state của React. Nhờ vậy dễ validate, reset form và xử lý dữ liệu trước khi submit.

Liên hệ project: Gần như tất cả form của project đều là controlled component, đặc biệt ở `RegisterPage`, `LoginPage`, `VerifyEmailPage` và `CheckoutPage`.

### Câu 38. useReducer dùng khi nào?

Trả lời ngắn: `useReducer` phù hợp khi state phức tạp, có nhiều nhánh cập nhật hoặc có logic chuyển trạng thái rõ ràng theo action. Nó giúp code dễ kiểm soát hơn so với quá nhiều `useState`.

Liên hệ project: Sneaker Shop hiện chủ yếu dùng `useState` vì state ở từng trang chưa quá phức tạp. Nếu sau này thêm admin dashboard hoặc nhiều bước checkout, `useReducer` sẽ hợp hơn.

### Câu 39. useState và useReducer khác nhau?

Trả lời ngắn: `useState` hợp cho state đơn giản, ít nhánh cập nhật. `useReducer` hợp cho state phức tạp hoặc khi muốn mô hình hóa cập nhật theo action rõ ràng.

Liên hệ project: Với project hiện tại, `useState` là đủ cho form, loading và dữ liệu trang. `useReducer` chưa thật sự cần thiết.

### Câu 40. Context API là gì?

Trả lời ngắn: Context API là cơ chế chia sẻ dữ liệu cho nhiều component mà không phải truyền props qua quá nhiều tầng. Nó hợp cho các dữ liệu dùng rộng như theme, user, locale.

Liên hệ project: Sneaker Shop hiện chưa dùng Context API. Auth đang dựa vào `localStorage` và mỗi trang tự gọi API hoặc đọc session khi cần.

### Câu 41. Props Drilling là gì?

Trả lời ngắn: Props Drilling là tình huống phải truyền props qua nhiều tầng component dù một số tầng trung gian không thực sự cần dữ liệu đó. Điều này làm code khó bảo trì hơn.

Liên hệ project: Project hạn chế props drilling bằng cách giữ state ở page level và tách component tương đối gọn, nên chưa gặp vấn đề quá lớn.

### Câu 42. Redux là gì?

Trả lời ngắn: Redux là thư viện quản lý global state theo mô hình store, action, reducer. Nó hữu ích khi dữ liệu dùng chung trên diện rộng và logic cập nhật phức tạp.

Liên hệ project: Sneaker Shop chưa dùng Redux. Với phạm vi hiện tại, local state + API module + `localStorage` là đủ.

### Câu 43. Redux Toolkit là gì?

Trả lời ngắn: Redux Toolkit là bộ công cụ chính thức giúp viết Redux ngắn gọn và chuẩn hơn. Nó giảm rất nhiều boilerplate so với Redux thuần.

Liên hệ project: Nếu sau này Sneaker Shop có admin dashboard lớn, nhiều bộ lọc, nhiều màn hình quản trị dùng chung state, Redux Toolkit có thể là lựa chọn tốt.

### Câu 44. Global State và Local State khác nhau?

Trả lời ngắn: Local state chỉ phục vụ một component hoặc một cụm nhỏ. Global state dùng chung cho nhiều nơi trong toàn ứng dụng.

Liên hệ project: Phần lớn state của Sneaker Shop là local state. Thứ mang tính toàn cục gần nhất hiện nay là token/user lưu trong `localStorage`.

### Câu 45. Khi nào không nên dùng Redux?

Trả lời ngắn: Không nên dùng Redux khi app còn nhỏ hoặc dữ liệu dùng chung chưa nhiều, vì sẽ tăng độ phức tạp không cần thiết. Chỉ nên dùng khi thật sự có nhu cầu về global state phức tạp.

Liên hệ project: Ở giai đoạn hiện tại, Sneaker Shop chưa cần Redux vì giỏ hàng, sản phẩm, đơn hàng đều đang lấy trực tiếp từ API theo từng page.

### Câu 46. Zustand là gì?

Trả lời ngắn: Zustand là thư viện quản lý state nhẹ, API đơn giản hơn Redux và ít boilerplate. Nó phù hợp khi muốn global state nhưng không muốn cấu trúc quá nặng.

Liên hệ project: Sneaker Shop chưa dùng Zustand. Nếu muốn đồng bộ mini cart, user session và một số UI state toàn cục gọn hơn, có thể cân nhắc trong tương lai.

### Câu 47. Re-render xảy ra khi nào?

Trả lời ngắn: Re-render xảy ra khi state đổi, props đổi, context đổi hoặc component cha re-render. Đây là cơ chế bình thường của React.

Liên hệ project: Các trang như `ProductSearchPage` và `CartPage` re-render khi dữ liệu API hoặc state filter/số lượng thay đổi.

### Câu 48. React.memo dùng để làm gì?

Trả lời ngắn: `React.memo` giúp component con không re-render lại nếu props không đổi. Nó hữu ích khi component con nặng hoặc danh sách dài.

Liên hệ project: Hiện project chưa tối ưu sâu đến mức phải dùng `React.memo` nhiều, nhưng có thể áp dụng cho card sản phẩm hoặc item giỏ hàng nếu quy mô tăng.

### Câu 49. useMemo và useCallback khác gì?

Trả lời ngắn: `useMemo` memoize value, còn `useCallback` memoize function. Cả hai đều dùng để tránh tạo lại thứ không cần thiết khi render.

Liên hệ project: Trong Sneaker Shop, có thể dùng chúng sau này cho filter, sort hoặc callback truyền sâu xuống các component danh sách.

### Câu 50. Immutable State là gì?

Trả lời ngắn: Immutable state nghĩa là không sửa trực tiếp object/array cũ mà tạo ra bản mới khi cập nhật. Cách này giúp React nhận ra dữ liệu đã đổi.

Liên hệ project: Các state object trong project thường được cập nhật bằng toán tử spread, ví dụ cập nhật form hoặc bộ lọc sản phẩm.

### Câu 51. Vì sao React cần immutable?

Trả lời ngắn: React so sánh tham chiếu để quyết định có nên cập nhật hay không, nên nếu mutate trực tiếp object cũ thì dễ gây lỗi hiển thị hoặc khó debug. Immutable giúp predictable hơn.

Liên hệ project: Khi cập nhật `formData`, `filters` hoặc dữ liệu giỏ hàng ở frontend, project luôn tạo giá trị mới thay vì sửa tại chỗ.

### Câu 52. Async State Update là gì?

Trả lời ngắn: Đây là việc cập nhật state không diễn ra đồng bộ ngay lập tức theo kiểu “gán xong là có kết quả ngay”. React có thể batch nhiều cập nhật rồi mới render lại.

Liên hệ project: Khi bấm submit form hoặc bấm hủy đơn, project thường set loading trước rồi chờ API xong mới cập nhật state tiếp theo.

### Câu 53. Redux Middleware là gì?

Trả lời ngắn: Redux Middleware là lớp nằm giữa `dispatch` và `reducer`, giúp xử lý logging, async, side effect hoặc can thiệp vào action. Ví dụ phổ biến là Thunk và Saga.

Liên hệ project: Sneaker Shop không dùng Redux middleware vì chưa dùng Redux. Logic async hiện nằm trong component và API module.

### Câu 54. Redux Thunk dùng để làm gì?

Trả lời ngắn: Redux Thunk cho phép action creator trả về function để xử lý async như gọi API rồi mới dispatch action thật. Nó đơn giản và phổ biến trong Redux.

Liên hệ project: Project chưa dùng Thunk. Thay vào đó, frontend gọi API trực tiếp bằng Axios trong từng page.

### Câu 55. Redux Saga khác Thunk thế nào?

Trả lời ngắn: Saga mạnh hơn cho side effect phức tạp như race, retry, cancel hoặc workflow dài; nhưng đổi lại khó học hơn. Thunk thì đơn giản và dễ bắt đầu hơn.

Liên hệ project: Với Sneaker Shop hiện tại, cả Thunk lẫn Saga đều chưa cần vì luồng frontend chưa quá phức tạp.

### Câu 56. Persist State là gì?

Trả lời ngắn: Persist state là lưu state ra nơi bền hơn như `localStorage`, `sessionStorage` hoặc database để sau khi refresh trang dữ liệu vẫn còn. Nó hay dùng cho auth, theme hoặc draft form.

Liên hệ project: Sneaker Shop đang persist `token`, `user`, `pendingVerificationEmail` và `pendingResetEmail` trong `localStorage`.

### Câu 57. Hydration trong React là gì?

Trả lời ngắn: Hydration là bước React gắn event và logic client vào HTML đã được server render sẵn. Khái niệm này thường đi với SSR.

Liên hệ project: Sneaker Shop không dùng SSR nên hydration không phải phần trọng tâm của project hiện tại.

### Câu 58. RTK Query là gì?

Trả lời ngắn: RTK Query là giải pháp fetch, cache và đồng bộ server state nằm trong Redux Toolkit. Nó giúp giảm boilerplate khi gọi API nhiều.

Liên hệ project: Sneaker Shop chưa dùng RTK Query, mà đang dùng `Axios` + `useEffect` + local state để lấy dữ liệu.

### Câu 59. So sánh Redux và Context API?

Trả lời ngắn: Context API hợp cho dữ liệu toàn cục đơn giản, còn Redux hợp cho global state phức tạp hơn, có middleware và luồng quản lý rõ ràng. Redux mạnh hơn nhưng nặng hơn.

Liên hệ project: Nếu Sneaker Shop chỉ cần chia sẻ auth hoặc theme đơn giản thì Context đã đủ; nếu có nhiều màn hình admin và state dùng chung phức tạp thì Redux Toolkit sẽ hợp hơn.

### Câu 60. Bạn sẽ chọn state management nào cho project?

Trả lời ngắn: Với quy mô hiện tại, em chọn local state + Axios + `localStorage` vì đủ dùng và dễ hiểu. Nếu project lớn hơn, em sẽ cân nhắc Context hoặc Zustand cho client state và React Query/RTK Query cho server state.

Liên hệ project: Quyết định hiện tại của Sneaker Shop là không dùng Redux để giữ code gọn, tập trung vào luồng nghiệp vụ thật như auth, cart, checkout và order tracking.

## Nhóm 3. Redis và cache

### Câu 61. Redis là gì?

Trả lời ngắn: Redis là in-memory data store dạng key-value, rất nhanh vì chủ yếu đọc ghi trong RAM. Nó thường được dùng như cache, session store, queue hoặc pub/sub broker.

Liên hệ project: Sneaker Shop hiện chưa dùng Redis. Giỏ hàng đang lưu bằng MongoDB trong model `Cart`.

### Câu 62. Redis khác MySQL/MongoDB thế nào?

Trả lời ngắn: Redis tối ưu cho tốc độ đọc ghi rất nhanh trên RAM, còn MySQL/MongoDB là database chính để lưu dữ liệu bền vững hơn. Redis thường bổ trợ cho database chính chứ không thay hoàn toàn trong đa số hệ thống web.

Liên hệ project: Project dùng MongoDB làm database chính cho user, product, cart và order; chưa cần Redis vì quy mô đồ án còn nhỏ.

### Câu 63. Vì sao Redis nhanh?

Trả lời ngắn: Redis nhanh vì dữ liệu nằm trong RAM, cấu trúc dữ liệu gọn và cơ chế xử lý rất tối ưu. Nó tránh được nhiều chi phí I/O đĩa so với database truyền thống.

Liên hệ project: Nếu sau này danh sách sản phẩm của Sneaker Shop có lượng truy cập lớn, Redis có thể giúp cache kết quả để phản hồi nhanh hơn.

### Câu 64. Redis thường dùng để làm gì?

Trả lời ngắn: Redis thường dùng cho cache, session, rate limiting, queue, pub/sub và lưu dữ liệu tạm thời có TTL. Đây là những nhu cầu cần tốc độ rất cao.

Liên hệ project: Sneaker Shop hiện chưa triển khai Redis, nhưng nếu mở rộng production thì cache sản phẩm hoặc session/rate limit là các hướng dùng hợp lý.

### Câu 65. Cache là gì?

Trả lời ngắn: Cache là lớp lưu tạm dữ liệu đã truy cập để lần sau lấy nhanh hơn thay vì tính toán hoặc truy vấn lại từ nguồn gốc. Nó giúp giảm tải hệ thống và giảm thời gian phản hồi.

Liên hệ project: Các API sản phẩm như `GET /api/products` là ứng viên tốt cho cache nếu project có nhiều người dùng thật.

### Câu 66. TTL trong Redis là gì?

Trả lời ngắn: TTL là thời gian sống của key. Khi hết TTL thì key tự bị xóa, rất hợp cho dữ liệu tạm như OTP, session hoặc cache.

Liên hệ project: Hiện OTP của Sneaker Shop chưa lưu bằng Redis mà lưu trong MongoDB với thời gian hết hạn qua các field expiry. Nếu dùng Redis thì TTL sẽ rất phù hợp cho OTP.

### Câu 67. Redis Data Types gồm gì?

Trả lời ngắn: Redis có các kiểu dữ liệu phổ biến như `String`, `Hash`, `List`, `Set`, `Sorted Set`, `Stream` và một số cấu trúc xác suất. Mỗi loại hợp với một bài toán khác nhau.

Liên hệ project: Nếu Sneaker Shop dùng Redis, `String` hoặc `Hash` có thể dùng cho cache sản phẩm, còn `Sorted Set` có thể dùng cho top sản phẩm xem nhiều.

### Câu 68. String trong Redis dùng khi nào?

Trả lời ngắn: `String` là kiểu đơn giản nhất, phù hợp để lưu token, mã OTP, số đếm, JSON serialize hoặc các giá trị cache nhỏ. Nó rất tiện cho đa số nhu cầu cache cơ bản.

Liên hệ project: Nếu cache response của `GET /api/products/:id`, project có thể lưu JSON sản phẩm dưới dạng string trong Redis.

### Câu 69. Hash trong Redis dùng khi nào?

Trả lời ngắn: `Hash` phù hợp để lưu object có nhiều field nhỏ như hồ sơ user, session metadata hoặc snapshot dữ liệu. Nó tiết kiệm hơn khi muốn cập nhật từng field.

Liên hệ project: Nếu sau này lưu session hoặc mini-profile user bằng Redis, `Hash` sẽ phù hợp hơn `String`.

### Câu 70. Redis Pub/Sub là gì?

Trả lời ngắn: Pub/Sub là cơ chế publish message vào channel và các subscriber đang nghe channel đó sẽ nhận message ngay. Nó phù hợp cho realtime message broadcast đơn giản.

Liên hệ project: Sneaker Shop chưa có realtime như thông báo đơn hàng theo thời gian thực, nên chưa cần Pub/Sub.

### Câu 71. Redis Queue là gì?

Trả lời ngắn: Redis queue là cách dùng Redis để đẩy và lấy job theo hàng đợi, thường xử lý tác vụ nền như gửi email, đồng bộ dữ liệu hoặc xử lý lâu. Nó giúp tách tác vụ nặng khỏi request chính.

Liên hệ project: Nếu muốn gửi email OTP hay email cập nhật đơn hàng theo nền thay vì trong request, Sneaker Shop có thể dùng queue.

### Câu 72. Session trong Redis là gì?

Trả lời ngắn: Đây là cách lưu session server-side trong Redis thay vì lưu ở RAM local của một process. Cách này phù hợp khi có nhiều instance backend.

Liên hệ project: Sneaker Shop đang dùng JWT stateless chứ không dùng session server-side, nên hiện chưa cần Redis cho session.

### Câu 73. Redis Persistence là gì?

Trả lời ngắn: Dù Redis chạy trên RAM, nó vẫn có thể ghi dữ liệu xuống đĩa bằng cơ chế như RDB hoặc AOF để giảm mất dữ liệu khi restart. Tuy nhiên nó vẫn không thay thế hoàn toàn database chính trong mọi trường hợp.

Liên hệ project: Vì project chưa dùng Redis nên persistence Redis chưa áp dụng. Database bền vững hiện tại vẫn là MongoDB.

### Câu 74. Redis có nhược điểm gì?

Trả lời ngắn: Redis tốn RAM, chi phí có thể cao khi dữ liệu lớn, và nếu thiết kế sai dễ gặp lỗi stale cache hoặc mất đồng bộ với database chính. Ngoài ra nó làm kiến trúc phức tạp hơn.

Liên hệ project: Với Sneaker Shop ở mức đồ án, thêm Redis ngay có thể làm hệ thống phức tạp hơn lợi ích nhận được.

### Câu 75. Rate Limiting bằng Redis?

Trả lời ngắn: Redis có thể lưu số lần request theo IP hoặc user trong một khoảng thời gian, rất phù hợp để rate limiting trên nhiều instance backend. Nhờ TTL, dữ liệu giới hạn sẽ tự hết hạn.

Liên hệ project: Sneaker Shop hiện dùng `express-rate-limit` cho các API auth, chưa dùng Redis. Nếu scale nhiều server, nên chuyển rate limit qua Redis.

### Câu 76. Cache Aside Pattern là gì?

Trả lời ngắn: Cache Aside nghĩa là ứng dụng đọc cache trước; nếu cache miss thì đọc database rồi ghi lại vào cache cho lần sau. Đây là pattern cache rất phổ biến.

Liên hệ project: Nếu áp dụng cho Sneaker Shop, flow của `GET /api/products` có thể là đọc Redis trước, miss thì đọc MongoDB rồi set cache.

### Câu 77. Cache Invalidation là gì?

Trả lời ngắn: Cache invalidation là làm mới hoặc xóa cache khi dữ liệu gốc thay đổi để tránh trả dữ liệu cũ. Đây là một trong những phần khó nhất khi dùng cache.

Liên hệ project: Nếu admin sửa giá hoặc tồn kho sản phẩm, cache sản phẩm của Sneaker Shop phải được xóa hoặc cập nhật ngay để không hiển thị sai.

### Câu 78. Redis Cluster là gì?

Trả lời ngắn: Redis Cluster là cơ chế chia dữ liệu trên nhiều node để scale ngang và tăng khả năng chịu lỗi. Nó phù hợp khi dữ liệu hoặc lưu lượng đã lớn.

Liên hệ project: Sneaker Shop hiện chưa cần cluster vì chưa dùng Redis và quy mô còn nhỏ.

### Câu 79. Redis Sentinel là gì?

Trả lời ngắn: Redis Sentinel là cơ chế giám sát và failover cho Redis master-replica. Nó giúp tăng tính sẵn sàng khi node chính gặp lỗi.

Liên hệ project: Đây là kiến thức production nâng cao, chưa áp dụng trong Sneaker Shop hiện tại.

### Câu 80. Khi nào không nên dùng Redis?

Trả lời ngắn: Không nên dùng Redis khi dữ liệu nhỏ, tải hệ thống thấp hoặc khi chi phí và độ phức tạp bổ sung lớn hơn lợi ích. Cũng không nên dùng Redis cho dữ liệu cần nhất quán tuyệt đối nếu chưa thiết kế kỹ.

Liên hệ project: Với Sneaker Shop ở mức đồ án, MongoDB đã đủ để lưu cart và order. Thêm Redis lúc này là chưa thật sự cần thiết.

### Câu 81. React frontend dùng Redis trực tiếp không?

Trả lời ngắn: Không. Frontend không nên kết nối trực tiếp tới Redis; frontend chỉ gọi backend API, còn backend mới là nơi truy cập Redis nếu có.

Liên hệ project: Frontend Sneaker Shop chỉ gọi Axios tới Express API, hoàn toàn không truy cập database hay Redis trực tiếp.

### Câu 82. Redis thường kết hợp React để làm gì?

Trả lời ngắn: Redis thường hỗ trợ backend phục vụ React nhanh hơn bằng cách cache API, lưu session, rate limit hoặc pub/sub cho realtime. React chỉ hưởng lợi gián tiếp qua response nhanh hơn.

Liên hệ project: Nếu áp dụng vào Sneaker Shop, Redis có thể giúp load danh sách sản phẩm nhanh hơn hoặc hỗ trợ realtime trạng thái đơn hàng sau này.

### Câu 83. React login với Redis session hoạt động sao?

Trả lời ngắn: Với mô hình session, sau khi login backend tạo session và lưu trong Redis, rồi gửi session id về cookie cho trình duyệt. Các request sau mang cookie, backend đọc session từ Redis để xác thực.

Liên hệ project: Sneaker Shop không dùng flow này. Project đang dùng JWT gửi qua `Authorization` header.

### Câu 84. Redis giúp React app nhanh hơn thế nào?

Trả lời ngắn: Redis không làm React nhanh ở phía browser, mà làm backend trả dữ liệu nhanh hơn nên React nhận response sớm hơn. Điều này cải thiện trải nghiệm tải trang và tìm kiếm.

Liên hệ project: Trang danh sách sản phẩm của Sneaker Shop là nơi dễ thấy lợi ích nhất nếu thêm cache Redis.

### Câu 85. React realtime chat dùng Redis như thế nào?

Trả lời ngắn: Trong hệ thống chat realtime, Redis thường làm pub/sub hoặc message broker giữa nhiều server Socket.IO. Nó giúp các instance chia sẻ sự kiện với nhau.

Liên hệ project: Sneaker Shop không có chat realtime nên chưa dùng mô hình này.

### Câu 86. Redis với Socket.IO dùng để làm gì?

Trả lời ngắn: Redis adapter cho Socket.IO giúp nhiều server chia sẻ room, event và message broadcast. Điều này cần khi app realtime chạy nhiều instance.

Liên hệ project: Project chưa có Socket.IO, nên phần này là kiến thức mở rộng chứ chưa phải triển khai thật.

### Câu 87. Vì sao cache API cho React app?

Trả lời ngắn: Cache API giúp giảm thời gian chờ, giảm số lần truy vấn database và tăng khả năng chịu tải. Điều này đặc biệt hữu ích với dữ liệu ít đổi nhưng được đọc nhiều.

Liên hệ project: `GET /api/products`, `GET /api/products/categories` hoặc top sản phẩm là các endpoint rất phù hợp để cache nếu Sneaker Shop phát triển lớn hơn.

### Câu 88. Ví dụ cache Express API bằng Redis

Trả lời ngắn: Flow thường là backend kiểm tra cache bằng key như `products:query`; nếu có thì trả ngay, nếu không thì lấy từ database rồi set lại cache với TTL. Đây là ứng dụng điển hình của Cache Aside.

Liên hệ project: Sneaker Shop chưa code phần này, nhưng có thể áp dụng trực tiếp cho `productService.getProducts`.

### Câu 89. Redis và JWT liên quan gì?

Trả lời ngắn: JWT vốn stateless và không bắt buộc cần Redis. Redis chỉ thường đi kèm khi muốn blacklist token, quản lý refresh token hoặc hỗ trợ session lai.

Liên hệ project: Sneaker Shop đang dùng JWT thuần, chưa có blacklist hay refresh token nên chưa cần Redis cho auth.

### Câu 90. Làm sao tránh cache stampede?

Trả lời ngắn: Có thể dùng lock, request coalescing, TTL lệch ngẫu nhiên hoặc stale-while-revalidate để tránh nhiều request cùng lúc làm cache miss rồi cùng đánh vào database. Đây là bài toán thường gặp ở hệ thống lớn.

Liên hệ project: Với lưu lượng đồ án, project chưa gặp vấn đề này. Nhưng nếu sau này cache sản phẩm bằng Redis thì nên tính đến.

### Câu 91. Cache warming là gì?

Trả lời ngắn: Cache warming là nạp sẵn dữ liệu quan trọng vào cache trước khi có nhiều request thật. Nó giúp tránh chậm ở những lượt truy cập đầu tiên.

Liên hệ project: Có thể dùng cache warming cho danh sách sản phẩm nổi bật hoặc best seller của Sneaker Shop sau khi deploy production.

### Câu 92. Làm sao scale Redis?

Trả lời ngắn: Có thể scale Redis bằng cách dùng replica, cluster, sharding và tối ưu key design. Ngoài ra cần giám sát RAM, latency và eviction policy.

Liên hệ project: Đây là phần mở rộng cho production quy mô lớn; Sneaker Shop hiện chưa đến mức cần scale Redis.

## Nhóm 4. Node.js, Express, API, JWT

### Câu 93. Node.js là gì?

Trả lời ngắn: Node.js là môi trường chạy JavaScript phía server, xây trên V8 engine. Nó rất phù hợp để xây REST API và các ứng dụng I/O nhiều.

Liên hệ project: Backend Sneaker Shop chạy bằng Node.js, và toàn bộ Express API đều nằm trên runtime này.

### Câu 94. Vì sao Node.js nhanh?

Trả lời ngắn: Node.js nhanh nhờ V8 engine và mô hình non-blocking I/O, nên không phải chờ tuần tự cho các tác vụ như gọi database hay network. Nó đặc biệt mạnh với web API và realtime.

Liên hệ project: Với các request như lấy sản phẩm, giỏ hàng, đơn hàng và gửi OTP email, Node.js phù hợp vì phần lớn là I/O chứ không phải tính toán nặng.

### Câu 95. Event Loop là gì?

Trả lời ngắn: Event Loop là cơ chế của Node.js dùng để xử lý callback, promise và các tác vụ bất đồng bộ sau khi I/O hoàn tất. Nhờ đó một tiến trình vẫn xử lý được nhiều request.

Liên hệ project: Các thao tác MongoDB, email OTP hay kiểm tra trạng thái đơn hàng đều hưởng lợi từ mô hình này.

### Câu 96. Blocking và Non-blocking khác nhau?

Trả lời ngắn: Blocking là phải chờ tác vụ xong mới làm tiếp, còn non-blocking là có thể giao tác vụ đi xử lý và tiếp tục nhận việc khác. Web API hiện đại thường ưu tiên non-blocking.

Liên hệ project: Sneaker Shop dùng async/await với Mongoose và Nodemailer, nên flow chính của backend đi theo hướng non-blocking.

### Câu 97. Callback là gì?

Trả lời ngắn: Callback là hàm được truyền vào hàm khác để được gọi lại khi một tác vụ hoàn tất. Đây là nền tảng của lập trình bất đồng bộ trong JavaScript.

Liên hệ project: Dù code hiện tại chủ yếu dùng async/await, bản chất nhiều API nền bên dưới vẫn dựa trên callback.

### Câu 98. Callback Hell là gì?

Trả lời ngắn: Callback Hell là tình trạng nhiều callback lồng nhau làm code khó đọc, khó debug và khó bảo trì. Đây là lý do Promise và async/await ra đời phổ biến hơn.

Liên hệ project: Sneaker Shop tránh callback hell bằng cách tổ chức logic qua `service` và dùng async/await gần như toàn bộ backend/frontend API flow.

### Câu 99. Promise là gì?

Trả lời ngắn: Promise đại diện cho kết quả của một tác vụ bất đồng bộ trong tương lai, có ba trạng thái chính là pending, fulfilled và rejected. Nó giúp xử lý async gọn hơn callback thuần.

Liên hệ project: Các thao tác như `await User.findOne(...)` hay `await axiosClient.get(...)` trong project thực chất dựa trên Promise.

### Câu 100. Async/Await là gì?

Trả lời ngắn: `async/await` là cú pháp giúp viết code bất đồng bộ trông giống code đồng bộ, dễ đọc và dễ bắt lỗi hơn. `await` chỉ dùng được trong hàm `async`.

Liên hệ project: Backend service, controller và frontend page của Sneaker Shop dùng async/await gần như xuyên suốt.

### Câu 101. require và import khác nhau?

Trả lời ngắn: `require` là cú pháp CommonJS, còn `import` là cú pháp ES Module. Hai hệ module này khác nhau về cú pháp, thời điểm nạp và cấu hình môi trường.

Liên hệ project: Backend Sneaker Shop dùng `require/module.exports`, còn frontend React Vite dùng `import/export`.

### Câu 102. package.json dùng để làm gì?

Trả lời ngắn: `package.json` mô tả thông tin project, dependencies, scripts và cấu hình npm. Nó là nơi định nghĩa cách cài và chạy ứng dụng.

Liên hệ project: Sneaker Shop có `package.json` riêng cho `backend` và `frontend`, ví dụ backend có script chạy server và seed dữ liệu.

### Câu 103. next() trong middleware là gì?

Trả lời ngắn: `next()` dùng để chuyển quyền xử lý sang middleware hoặc handler kế tiếp. Nếu không gọi `next()` hoặc không trả response, request sẽ bị treo.

Liên hệ project: Các middleware như `protect`, validation và rate limit đều cần phối hợp đúng với `next()` để request đi tiếp đến controller.

### Câu 104. Express Router là gì?

Trả lời ngắn: Express Router là cách tách route thành từng module thay vì viết hết trong `server.js`. Nó giúp backend rõ cấu trúc và dễ bảo trì hơn.

Liên hệ project: Sneaker Shop tách thành `authRoutes.js`, `productRoutes.js`, `cartRoutes.js`, `orderRoutes.js`.

### Câu 105. body-parser là gì?

Trả lời ngắn: `body-parser` là middleware đọc body request, đặc biệt là JSON hoặc form data. Từ Express 4.16 trở đi, nhiều trường hợp có thể dùng `express.json()` và `express.urlencoded()` thay thế.

Liên hệ project: Sneaker Shop đang dùng `express.json()` trong `server.js`, không cài `body-parser` riêng.

### Câu 106. bcrypt dùng để làm gì?

Trả lời ngắn: `bcrypt` dùng để hash password một chiều, giúp không lưu mật khẩu dạng plaintext. Khi login, hệ thống so sánh password nhập vào với hash đã lưu.

Liên hệ project: Model `User` của Sneaker Shop có hook `pre('save')` để hash password bằng bcrypt và method `comparePassword` để kiểm tra lúc login.

### Câu 107. Hash và Encrypt khác nhau?

Trả lời ngắn: Hash là một chiều, không giải mã ngược lại được; encrypt là hai chiều, có thể giải mã nếu có key. Password thường phải hash chứ không encrypt.

Liên hệ project: Password user được hash bằng `bcrypt`, còn OTP verification được hash bằng `sha256` trước khi lưu.

### Câu 108. Xử lý lỗi Express như thế nào?

Trả lời ngắn: Thông thường có thể bắt lỗi trong controller/service rồi trả về status code và message phù hợp, hoặc dùng global error middleware để gom xử lý. Điều quan trọng là không để lỗi rơi tự do.

Liên hệ project: Sneaker Shop đang bắt lỗi chủ yếu trong controller bằng `try/catch`, còn service ném ra error có `statusCode` và `publicMessage` để controller trả JSON thống nhất.

### Câu 109. Multer dùng để làm gì?

Trả lời ngắn: Multer là middleware xử lý upload file trong Express, đặc biệt với `multipart/form-data`. Nó thường dùng cho upload ảnh, avatar hoặc tài liệu.

Liên hệ project: Sneaker Shop chưa có tính năng upload file nên chưa dùng Multer.

### Câu 110. Socket.IO dùng để làm gì?

Trả lời ngắn: Socket.IO dùng để tạo kết nối realtime hai chiều giữa client và server. Nó phù hợp cho chat, thông báo trực tiếp, dashboard realtime hoặc tracking thời gian thực.

Liên hệ project: Project hiện chưa dùng Socket.IO; theo dõi đơn hàng đang theo kiểu user mở trang rồi frontend gọi REST API để lấy trạng thái mới nhất.

### Câu 111. Vì sao Node.js phù hợp realtime?

Trả lời ngắn: Vì Node.js non-blocking và xử lý nhiều kết nối đồng thời tốt, nên nó hợp cho các bài toán realtime như chat, game nhẹ hoặc notification. Socket.IO thường kết hợp rất tốt với Node.

Liên hệ project: Dù Sneaker Shop chưa có realtime, nếu sau này làm thông báo trạng thái đơn hàng tức thời thì Node.js vẫn là nền phù hợp.

### Câu 112. MVC trong Express là gì?

Trả lời ngắn: MVC là cách tách `Model`, `View`, `Controller` để code rõ vai trò hơn. Trong web API hiện đại, nhiều project còn chen thêm `service` để tách business logic khỏi controller.

Liên hệ project: Backend Sneaker Shop không theo MVC thuần mà theo dạng `route -> controller -> service -> model`, còn `View` nằm ở frontend React chứ không ở backend.

### Câu 113. Monolith và Microservice khác nhau?

Trả lời ngắn: Monolith là hệ thống backend đóng gói thành một khối ứng dụng chính, còn microservice chia thành nhiều service nhỏ độc lập. Microservice scale linh hoạt hơn nhưng phức tạp hơn nhiều.

Liên hệ project: Backend Sneaker Shop hiện là monolith. Frontend và backend có tách thư mục, nhưng backend vẫn là một service Express duy nhất.

### Câu 114. API là gì?

Trả lời ngắn: API là giao diện để các hệ thống hoặc các phần mềm giao tiếp với nhau. Trong web, frontend thường gọi API backend để lấy hoặc ghi dữ liệu.

Liên hệ project: Frontend Sneaker Shop gọi API backend qua Axios để đăng nhập, lấy sản phẩm, thao tác giỏ hàng và quản lý đơn hàng.

### Câu 115. REST API là gì?

Trả lời ngắn: REST API là kiểu API tổ chức theo tài nguyên và HTTP method, ví dụ GET để lấy dữ liệu, POST để tạo, PUT/PATCH để cập nhật, DELETE để xóa. Nó thường stateless.

Liên hệ project: Toàn bộ backend của Sneaker Shop đang thiết kế theo hướng REST tương đối rõ ràng.

### Câu 116. HTTP Methods gồm những gì?

Trả lời ngắn: Phổ biến nhất là `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. Mỗi method biểu diễn một loại thao tác khác nhau trên tài nguyên.

Liên hệ project: Sneaker Shop dùng `GET` cho lấy dữ liệu, `POST` cho đăng ký/login/checkout/thêm giỏ, `PUT` cho cập nhật hồ sơ hoặc hủy đơn, `DELETE` cho xóa item và xóa giỏ hàng.

### Câu 117. Khác nhau giữa PUT và PATCH?

Trả lời ngắn: `PUT` thường mang nghĩa cập nhật toàn bộ tài nguyên hoặc thay thế bản ghi, còn `PATCH` thường là cập nhật một phần. Trên thực tế nhiều hệ thống vẫn dùng linh hoạt tùy convention.

Liên hệ project: Sneaker Shop đang dùng `PUT` cho các thao tác cập nhật như `/auth/me`, `/cart/items/:itemId`, `/orders/:orderId/cancel`.

### Câu 118. HTTP Status Code thường dùng?

Trả lời ngắn: Các mã thường dùng là `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`. Trả đúng status giúp client xử lý tốt hơn.

Liên hệ project: Sneaker Shop có dùng đủ nhiều mã này, ví dụ `201` khi đăng ký/checkout, `401` khi sai đăng nhập, `403` khi email chưa xác thực, `409` khi trùng email hoặc studentId.

### Câu 119. JSON là gì?

Trả lời ngắn: JSON là định dạng dữ liệu văn bản rất phổ biến trong web API, dễ đọc cho cả người và máy. Frontend và backend JavaScript làm việc với JSON rất tự nhiên.

Liên hệ project: Response của backend Sneaker Shop trả về JSON với các field như `success`, `message`, `data`, đôi khi có thêm `token` và `redirectUrl`.

### Câu 120. Endpoint là gì?

Trả lời ngắn: Endpoint là một URL API cụ thể để client gọi vào nhằm thực hiện một chức năng nào đó. Nó là điểm truy cập của một tài nguyên hoặc hành động.

Liên hệ project: Ví dụ endpoint của Sneaker Shop gồm `/api/auth/login`, `/api/products`, `/api/cart/items`, `/api/orders/checkout`.

### Câu 121. Request và Response khác nhau?

Trả lời ngắn: Request là dữ liệu client gửi lên server, còn response là dữ liệu server trả về cho client. Một request thường gồm method, URL, header, body; response thường gồm status, header và body.

Liên hệ project: Ví dụ khi checkout, frontend gửi request chứa `shippingAddress` và `paymentMethod`; backend trả response chứa `message` và `order` mới tạo.

### Câu 122. Header trong API là gì?

Trả lời ngắn: Header là phần metadata đi kèm request/response, ví dụ `Content-Type`, `Authorization`, `Accept`. Nó giúp mô tả cách dữ liệu cần được hiểu hoặc xử lý.

Liên hệ project: Sneaker Shop dùng header `Authorization: Bearer <token>` cho các API cần đăng nhập, và `Content-Type: application/json`.

### Câu 123. Flow login JWT hoạt động sao?

Trả lời ngắn: Người dùng gửi thông tin đăng nhập, backend kiểm tra tài khoản và mật khẩu, sau đó tạo JWT và trả về client. Những request sau gửi token kèm header để backend xác thực.

Liên hệ project: Riêng Sneaker Shop có thêm một bước trước đó là xác thực email bằng OTP sau khi đăng ký. Sau khi login hoặc verify OTP xong, frontend lưu token vào `localStorage` rồi gọi API protected.

### Câu 124. Access Token và Refresh Token khác nhau?

Trả lời ngắn: Access token thường sống ngắn và dùng trực tiếp để gọi API; refresh token sống dài hơn để xin access token mới. Mô hình này tăng bảo mật hơn so với dùng một token dài hạn duy nhất.

Liên hệ project: Sneaker Shop hiện chỉ dùng một JWT như access token, chưa triển khai refresh token.

### Câu 125. Nên lưu JWT ở đâu?

Trả lời ngắn: Với đồ án học tập có thể lưu trong `localStorage`, nhưng production nên cân nhắc `HttpOnly Cookie` cho refresh token và giảm thời gian sống của access token. Cần luôn cân nhắc rủi ro XSS.

Liên hệ project: Sneaker Shop đang lưu token trong `localStorage` và gắn lại bằng interceptor Axios.

### Câu 126. API versioning là gì?

Trả lời ngắn: API versioning là cách quản lý phiên bản API để thay đổi hệ thống mà không làm vỡ client cũ, ví dụ `/api/v1/...`. Nó quan trọng khi hệ thống có nhiều client hoặc sống lâu dài.

Liên hệ project: Sneaker Shop hiện chỉ có tiền tố `/api`, chưa versioning riêng. Nếu phát triển lâu dài thì nên thêm `/api/v1`.

### Câu 127. Idempotent API là gì?

Trả lời ngắn: Idempotent nghĩa là gọi cùng một request nhiều lần vẫn cho cùng kết quả trạng thái cuối. `GET`, nhiều `PUT` và `DELETE` thường hướng tới tính chất này.

Liên hệ project: `DELETE /api/cart` của Sneaker Shop gần như idempotent vì gọi nhiều lần thì giỏ vẫn rỗng. `POST /api/cart/items` thì không idempotent vì gọi lại sẽ cộng thêm số lượng.

### Câu 128. Stateless API là gì?

Trả lời ngắn: Stateless API nghĩa là server không cần nhớ trạng thái phiên giữa các request; mỗi request tự mang đủ thông tin cần thiết. Điều này giúp scale hệ thống dễ hơn.

Liên hệ project: Sneaker Shop đang khá stateless vì backend đọc JWT từ header ở mỗi request, không dựa vào session server-side.

### Câu 129. WebSocket khác REST API thế nào?

Trả lời ngắn: REST là request-response ngắt quãng, còn WebSocket là kết nối hai chiều giữ lâu dài. WebSocket phù hợp cho realtime, còn REST phù hợp CRUD và API business thông thường.

Liên hệ project: Sneaker Shop hiện dùng REST API cho toàn bộ chức năng. Nếu thêm thông báo trạng thái đơn hàng tức thời thì mới cân nhắc WebSocket.

### Câu 130. GraphQL là gì?

Trả lời ngắn: GraphQL là ngôn ngữ truy vấn API cho phép client chỉ lấy đúng field mình cần thay vì nhận response cố định như REST. Nó mạnh nhưng cũng làm backend phức tạp hơn.

Liên hệ project: Sneaker Shop chọn REST thay vì GraphQL vì dễ hiểu, dễ làm và phù hợp phạm vi môn học.

## Nhóm 5. Tổng hợp state, giỏ hàng, deploy, kiến trúc

### Câu 131. Các cách quản lý state trong React

Trả lời ngắn: Các cách phổ biến là local state (`useState`, `useReducer`), Context API, thư viện global state như Redux/Zustand và thư viện server state như React Query/RTK Query. Chọn cách nào tùy độ phức tạp bài toán.

Liên hệ project: Sneaker Shop hiện dùng local state là chính, kết hợp `localStorage` cho auth session; chưa dùng Redux hay React Query.

### Câu 132. Vì sao React Query không thay Redux hoàn toàn?

Trả lời ngắn: React Query mạnh về server state như fetch, cache, refetch, còn Redux thường giải bài toán client global state và workflow phức tạp hơn. Hai công cụ giải quyết trọng tâm khác nhau.

Liên hệ project: Nếu sau này Sneaker Shop muốn cache danh sách sản phẩm, React Query sẽ hữu ích; nhưng nó vẫn không thay vai trò global UI/client state nếu project có nhu cầu lớn hơn.

### Câu 133. Có bao nhiêu cách phổ biến lưu giỏ hàng

Trả lời ngắn: Thường có ba hướng chính: lưu ở client như `localStorage`, lưu ở database theo user, hoặc lưu tạm ở cache/session như Redis. Mỗi cách cân bằng khác nhau giữa đơn giản, bền vững và khả năng scale.

Liên hệ project: Sneaker Shop chọn lưu giỏ hàng trong `MongoDB` theo user bằng model `Cart`, nên đăng nhập lại vẫn thấy giỏ và backend dễ kiểm soát dữ liệu hơn.

### Câu 134. Khi nào nên và không nên dùng Redis cho giỏ hàng?

Trả lời ngắn: Nên dùng Redis khi cần tốc độ rất cao, lượng truy cập lớn, giỏ hàng mang tính tạm thời hoặc cần scale nhiều instance. Không nên dùng khi hệ thống còn nhỏ hoặc database hiện tại đã đủ đáp ứng.

Liên hệ project: Với Sneaker Shop hiện tại, MongoDB đã đủ cho giỏ hàng. Redis chỉ nên cân nhắc khi project phát triển thành production có lưu lượng lớn hơn.

### Câu 135. Tổng quan các cách deploy

Trả lời ngắn: Có thể deploy theo kiểu tách frontend và backend lên các nền tảng cloud, hoặc gom vào VPS, hoặc đóng gói bằng Docker. Cách chọn tùy vào chi phí, kỹ năng vận hành và mức độ chuyên nghiệp mong muốn.

Liên hệ project: Với Sneaker Shop, hướng hợp lý là deploy frontend lên Vercel/Netlify, backend lên Render/Railway/VPS và MongoDB lên Atlas.

### Câu 136. Docker giúp gì?

Trả lời ngắn: Docker giúp đóng gói ứng dụng cùng môi trường chạy, giảm lỗi “máy em chạy được nhưng máy khác không chạy được”. Nó cũng thuận tiện cho deploy và CI/CD.

Liên hệ project: Sneaker Shop hiện chưa có `Dockerfile`, nhưng nếu làm tiếp thì Docker sẽ giúp chuẩn hóa môi trường cho cả frontend và backend.

### Câu 137. Vì sao tách frontend/backend?

Trả lời ngắn: Tách frontend/backend giúp rõ trách nhiệm, dễ chia việc nhóm, dễ bảo trì và có thể deploy độc lập. Nó cũng tạo ranh giới API rõ ràng cho hệ thống.

Liên hệ project: Sneaker Shop tách thư mục `frontend` và `backend`, frontend chỉ gọi API qua Axios còn backend chỉ tập trung xử lý nghiệp vụ và dữ liệu. Đây là một điểm dễ trình bày khi vấn đáp vì kiến trúc khá rõ ràng.
