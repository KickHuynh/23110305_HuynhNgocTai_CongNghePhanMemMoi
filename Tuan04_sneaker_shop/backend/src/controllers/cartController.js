const cartService = require('../services/cartService');

// Chuẩn hóa lỗi từ service giỏ hàng trước khi trả về frontend.
const handleError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.publicMessage || fallbackMessage,
  });
};

// Trả về giỏ hàng hiện tại của người dùng đăng nhập.
const getMyCart = async (req, res) => {
  try {
    const result = await cartService.getMyCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        cart: result.cart,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve cart');
  }
};

// Thêm sản phẩm vào giỏ hàng hoặc cộng dồn với dòng đã có.
const addToCart = async (req, res) => {
  try {
    const result = await cartService.addToCart(req.user._id, req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        cart: result.cart,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to add item to cart');
  }
};

// Cập nhật số lượng của một dòng sản phẩm trong giỏ hàng.
const updateCartItem = async (req, res) => {
  try {
    const result = await cartService.updateCartItem(
      req.user._id,
      req.params.itemId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        cart: result.cart,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to update cart item');
  }
};

// Xóa một sản phẩm cụ thể khỏi giỏ hàng.
const removeCartItem = async (req, res) => {
  try {
    const result = await cartService.removeCartItem(
      req.user._id,
      req.params.itemId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        cart: result.cart,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to remove cart item');
  }
};

// Làm rỗng giỏ hàng của người dùng hiện tại.
const clearCart = async (req, res) => {
  try {
    const result = await cartService.clearCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        cart: result.cart,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to clear cart');
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
