const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicMessage = message;

  return error;
};

const getEffectivePrice = (product) => {
  const price = Number(product?.price || 0);
  const salePrice = Number(product?.salePrice || 0);

  return salePrice > 0 && salePrice < price ? salePrice : price;
};

const getPrimaryImage = (product) =>
  Array.isArray(product?.images) && product.images.length > 0
    ? product.images[0]
    : '';

const normalizeSelection = (value) => String(value || '').trim();

const recalculateCart = (cart) => {
  cart.totalItems = cart.items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
  cart.subtotal = cart.items.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return cart;
};

const ensureCart = async (userId) => {
  return Cart.findOneAndUpdate(
    { user: userId },
    {
      $setOnInsert: {
        user: userId,
        items: [],
        totalItems: 0,
        subtotal: 0,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
};

const validateProductAvailability = (product, size, color) => {
  if (!product) {
    throw createServiceError('Product not found', 404);
  }

  if (product.status !== 'active') {
    throw createServiceError('This product is not available for purchase', 400);
  }

  if (
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    !product.sizes.includes(size)
  ) {
    throw createServiceError('Selected size is not available for this product', 400);
  }

  if (
    Array.isArray(product.colors) &&
    product.colors.length > 0 &&
    !product.colors.includes(color)
  ) {
    throw createServiceError('Selected color is not available for this product', 400);
  }
};

const syncCartSnapshots = async (cart) => {
  if (!cart || cart.items.length === 0) {
    return {
      cart: recalculateCart(cart),
      changed: false,
    };
  }

  const productIds = [
    ...new Set(
      cart.items
        .map((item) => String(item.product || ''))
        .filter((productId) => mongoose.Types.ObjectId.isValid(productId))
    ),
  ];

  const products = await Product.find({
    _id: { $in: productIds },
  });
  const productsById = new Map(
    products.map((product) => [String(product._id), product])
  );

  let changed = false;

  cart.items.forEach((item) => {
    const product = productsById.get(String(item.product));

    if (!product) {
      if (Number(item.stockSnapshot || 0) !== 0) {
        item.stockSnapshot = 0;
        changed = true;
      }

      return;
    }

    const nextPrice = getEffectivePrice(product);
    const nextImage = getPrimaryImage(product);
    const nextStockSnapshot = Number(product.stock || 0);

    if (item.name !== product.name) {
      item.name = product.name;
      changed = true;
    }

    if (item.image !== nextImage) {
      item.image = nextImage;
      changed = true;
    }

    if (Number(item.price || 0) !== nextPrice) {
      item.price = nextPrice;
      changed = true;
    }

    if (Number(item.stockSnapshot || 0) !== nextStockSnapshot) {
      item.stockSnapshot = nextStockSnapshot;
      changed = true;
    }
  });

  const previousTotalItems = Number(cart.totalItems || 0);
  const previousSubtotal = Number(cart.subtotal || 0);
  recalculateCart(cart);

  if (
    previousTotalItems !== Number(cart.totalItems || 0) ||
    previousSubtotal !== Number(cart.subtotal || 0)
  ) {
    changed = true;
  }

  return {
    cart,
    changed,
  };
};

const getMyCart = async (userId) => {
  const cart = await ensureCart(userId);
  const syncedCart = await syncCartSnapshots(cart);

  if (syncedCart.changed) {
    await cart.save();
  }

  return {
    message: 'Cart retrieved successfully',
    cart,
  };
};

const addToCart = async (userId, payload = {}) => {
  const { productId, quantity } = payload;
  const size = normalizeSelection(payload.size);
  const color = normalizeSelection(payload.color);
  const parsedQuantity = Number(quantity);

  if (!mongoose.Types.ObjectId.isValid(productId || '')) {
    throw createServiceError('A valid product ID is required', 400);
  }

  if (!size) {
    throw createServiceError('Size is required', 400);
  }

  if (!color) {
    throw createServiceError('Color is required', 400);
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    throw createServiceError('Quantity must be at least 1', 400);
  }

  const product = await Product.findById(productId);
  validateProductAvailability(product, size, color);

  if (parsedQuantity > Number(product.stock || 0)) {
    throw createServiceError(
      `Quantity cannot exceed available stock (${product.stock || 0})`,
      400
    );
  }

  const cart = await ensureCart(userId);
  const existingItem = cart.items.find(
    (item) =>
      String(item.product) === String(product._id) &&
      item.size === size &&
      item.color === color
  );

  if (existingItem) {
    const nextQuantity = Number(existingItem.quantity || 0) + parsedQuantity;

    if (nextQuantity > Number(product.stock || 0)) {
      throw createServiceError(
        `Total quantity for this product cannot exceed available stock (${product.stock || 0})`,
        400
      );
    }

    existingItem.quantity = nextQuantity;
    existingItem.name = product.name;
    existingItem.image = getPrimaryImage(product);
    existingItem.price = getEffectivePrice(product);
    existingItem.stockSnapshot = Number(product.stock || 0);
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: getPrimaryImage(product),
      price: getEffectivePrice(product),
      size,
      color,
      quantity: parsedQuantity,
      stockSnapshot: Number(product.stock || 0),
    });
  }

  recalculateCart(cart);
  await cart.save();

  return {
    message: 'Added product to cart successfully',
    cart,
  };
};

const updateCartItem = async (userId, itemId, payload = {}) => {
  const parsedQuantity = Number(payload.quantity);
  const cart = await ensureCart(userId);
  const item = cart.items.id(itemId);

  if (!item) {
    throw createServiceError('Cart item not found', 404);
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    throw createServiceError('Quantity must be at least 1', 400);
  }

  const product = await Product.findById(item.product);
  validateProductAvailability(
    product,
    normalizeSelection(item.size),
    normalizeSelection(item.color)
  );

  if (parsedQuantity > Number(product.stock || 0)) {
    throw createServiceError(
      `Quantity cannot exceed available stock (${product.stock || 0})`,
      400
    );
  }

  item.quantity = parsedQuantity;
  item.name = product.name;
  item.image = getPrimaryImage(product);
  item.price = getEffectivePrice(product);
  item.stockSnapshot = Number(product.stock || 0);

  recalculateCart(cart);
  await cart.save();

  return {
    message: 'Cart item updated successfully',
    cart,
  };
};

const removeCartItem = async (userId, itemId) => {
  const cart = await ensureCart(userId);
  const item = cart.items.id(itemId);

  if (!item) {
    throw createServiceError('Cart item not found', 404);
  }

  cart.items.pull({ _id: itemId });
  recalculateCart(cart);
  await cart.save();

  return {
    message: 'Cart item removed successfully',
    cart,
  };
};

const clearCart = async (userId) => {
  const cart = await ensureCart(userId);

  cart.items = [];
  recalculateCart(cart);
  await cart.save();

  return {
    message: 'Cart cleared successfully',
    cart,
  };
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
