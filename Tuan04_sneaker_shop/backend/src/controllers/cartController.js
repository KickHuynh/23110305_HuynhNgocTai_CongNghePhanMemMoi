const cartService = require('../services/cartService');

const handleError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.publicMessage || fallbackMessage,
  });
};

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
