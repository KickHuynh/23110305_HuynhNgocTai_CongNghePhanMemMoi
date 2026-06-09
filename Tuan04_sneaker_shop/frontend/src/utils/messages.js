// Ánh xạ trực tiếp thông báo backend sang câu tiếng Việt dễ hiểu hơn.
const EXACT_MESSAGE_MAP = {
  'Validation failed': 'Dữ liệu không hợp lệ.',
  'A valid email is required': 'Vui lòng nhập email hợp lệ.',
  'Password is required': 'Vui lòng nhập mật khẩu.',
  'Full name is required and must be at least 2 characters':
    'Họ và tên là bắt buộc và phải có ít nhất 2 ký tự.',
  'Student ID is required': 'Vui lòng nhập mã sinh viên.',
  'Password is required and must be at least 6 characters':
    'Mật khẩu là bắt buộc và phải có ít nhất 6 ký tự.',
  'OTP is required and must be 6 digits':
    'Mã OTP là bắt buộc và phải gồm 6 chữ số.',
  'New password is required and must be at least 6 characters':
    'Mật khẩu mới là bắt buộc và phải có ít nhất 6 ký tự.',
  'Role cannot be updated from this API':
    'Không thể cập nhật vai trò từ API này.',
  'Password cannot be updated from this API':
    'Không thể cập nhật mật khẩu từ API này.',
  'Full name must be at least 2 characters':
    'Họ và tên phải có ít nhất 2 ký tự.',
  'Email must be a valid email address': 'Email phải đúng định dạng hợp lệ.',
  'Student ID cannot be empty': 'Mã sinh viên không được để trống.',
  'You are not logged in': 'Bạn chưa đăng nhập.',
  'User no longer exists': 'Tài khoản không còn tồn tại.',
  'Invalid or expired token': 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.',
  'Register successfully. Please verify OTP sent to your email.':
    'Đăng ký thành công. Vui lòng xác thực mã OTP đã được gửi đến email của bạn.',
  'Verify register OTP successfully': 'Xác thực OTP đăng ký thành công.',
  'Login successfully': 'Đăng nhập thành công.',
  'Reset password successfully': 'Đặt lại mật khẩu thành công.',
  'Get current user successfully': 'Lấy thông tin người dùng hiện tại thành công.',
  'Update profile successfully': 'Cập nhật hồ sơ thành công.',
  'Product retrieved successfully': 'Lấy chi tiết sản phẩm thành công.',
  'Product not found': 'Không tìm thấy sản phẩm.',
  'This product is not available for purchase':
    'Sản phẩm này hiện không thể mua.',
  'Selected size is not available for this product':
    'Kích cỡ đã chọn hiện không có sẵn cho sản phẩm này.',
  'Selected color is not available for this product':
    'Màu sắc đã chọn hiện không có sẵn cho sản phẩm này.',
  'Quantity must be at least 1': 'Số lượng phải lớn hơn hoặc bằng 1.',
  'Cart retrieved successfully': 'Lấy giỏ hàng thành công.',
  'Added product to cart successfully': 'Thêm vào giỏ hàng thành công.',
  'Cart item updated successfully':
    'Cập nhật sản phẩm trong giỏ hàng thành công.',
  'Cart item removed successfully': 'Xóa sản phẩm khỏi giỏ hàng thành công.',
  'Cart cleared successfully': 'Xóa giỏ hàng thành công.',
  'Cart item not found': 'Không tìm thấy sản phẩm trong giỏ hàng.',
  'Size is required': 'Vui lòng chọn kích cỡ.',
  'Color is required': 'Vui lòng chọn màu sắc.',
  'Your cart is empty': 'Giỏ hàng đang trống.',
  'Only COD payment is supported right now':
    'Hiện tại chỉ hỗ trợ thanh toán khi nhận hàng (COD).',
  'You must be logged in to checkout':
    'Bạn cần đăng nhập để thực hiện đặt hàng.',
  'Checkout completed successfully': 'Đặt hàng thành công.',
  'Orders retrieved successfully': 'Lấy danh sách đơn hàng thành công.',
  'Order retrieved successfully': 'Lấy chi tiết đơn hàng thành công.',
  'Order not found': 'Không tìm thấy đơn hàng.',
  'This order is already cancelled': 'Đơn hàng này đã bị hủy.',
  'A cancellation request has already been sent to the shop':
    'Yêu cầu hủy đơn đã được gửi tới shop.',
  'This order can no longer be cancelled at its current status':
    'Không thể hủy đơn ở trạng thái hiện tại.',
  'This order cannot be cancelled from its current status':
    'Không thể hủy đơn ở trạng thái hiện tại.',
  'Orders can only be cancelled within 30 minutes after placement':
    'Chỉ có thể hủy đơn trong vòng 30 phút sau khi đặt hàng.',
  'Cancellation request sent to shop':
    'Đã gửi yêu cầu hủy đơn tới shop.',
  'Cancellation request sent to shop successfully':
    'Gửi yêu cầu hủy đơn thành công.',
  'Order cancelled successfully': 'Hủy đơn hàng thành công.',
  'Order created successfully': 'Đặt hàng thành công.',
  'Order automatically confirmed after 30 minutes':
    'Đơn hàng được tự động xác nhận sau 30 phút.',
  'Status updated': 'Trạng thái đã được cập nhật.',
  'Order status updated successfully':
    'Cập nhật trạng thái đơn hàng thành công.',
  'Something went wrong': 'Đã xảy ra lỗi, vui lòng thử lại.',
  'Please try again in a moment.': 'Vui lòng thử lại sau ít phút.',
};

// Dịch các thông báo động có chứa tên sản phẩm hoặc số lượng tồn kho.
const PREFIX_TRANSLATORS = [
  {
    test: (message) =>
      message.startsWith('Quantity cannot exceed available stock ('),
    translate: (message) =>
      message.replace(
        'Quantity cannot exceed available stock (',
        'Số lượng không được vượt quá tồn kho hiện có ('
      ),
  },
  {
    test: (message) =>
      message.startsWith(
        'Total quantity for this product cannot exceed available stock ('
      ),
    translate: (message) =>
      message.replace(
        'Total quantity for this product cannot exceed available stock (',
        'Tổng số lượng cho sản phẩm này không được vượt quá tồn kho hiện có ('
      ),
  },
  {
    test: (message) =>
      message.startsWith('Not enough stock for "') &&
      message.includes('Available stock:'),
    translate: (message) =>
      message
        .replace('Not enough stock for "', 'Sản phẩm "')
        .replace('". Available stock: ', '" không đủ tồn kho. Số lượng còn lại: '),
  },
  {
    test: (message) =>
      message.startsWith('Unable to reserve stock for "') &&
      message.endsWith('Please review your cart and try again.'),
    translate: (message) =>
      message
        .replace('Unable to reserve stock for "', 'Không thể giữ tồn kho cho sản phẩm "')
        .replace(
          '". Please review your cart and try again.',
          '". Vui lòng kiểm tra lại giỏ hàng và thử lại.'
        ),
  },
  {
    test: (message) => message.startsWith('Order cancelled by user. Reason: '),
    translate: (message) =>
      message.replace(
        'Order cancelled by user. Reason: ',
        'Đơn hàng đã bị hủy bởi người dùng. Lý do: '
      ),
  },
  {
    test: (message) => message === 'Order cancelled by user',
    translate: () => 'Đơn hàng đã bị hủy bởi người dùng.',
  },
  {
    test: (message) => message.startsWith('Order status updated to '),
    translate: (message) =>
      message.replace(
        'Order status updated to ',
        'Trạng thái đơn hàng đã được cập nhật thành '
      ),
  },
];

export const translateMessage = (message, fallback = '') => {
  const resolvedMessage = String(message || fallback || '').trim();

  if (!resolvedMessage) {
    return 'Đã xảy ra lỗi, vui lòng thử lại.';
  }

  if (EXACT_MESSAGE_MAP[resolvedMessage]) {
    return EXACT_MESSAGE_MAP[resolvedMessage];
  }

  for (const translator of PREFIX_TRANSLATORS) {
    if (translator.test(resolvedMessage)) {
      return translator.translate(resolvedMessage);
    }
  }

  return resolvedMessage;
};

export const translateValidationErrors = (errors) => {
  if (!Array.isArray(errors)) {
    return errors;
  }

  return errors.map((error) => translateMessage(error));
};
