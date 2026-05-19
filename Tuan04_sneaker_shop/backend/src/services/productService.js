const Product = require('../models/Product');

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicMessage = message;

  return error;
};

const parsePositiveInt = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
};

const buildProductQuery = (params) => {
  const {
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    size,
    color,
    inStock,
    isPromotion,
    isNewProduct,
    isBestSeller,
  } = params;

  const query = { status: 'active' };

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (category) query.category = category;
  if (brand) query.brand = brand;

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (size) query.sizes = size;
  if (color) query.colors = color;

  if (isPromotion === 'true') query.isPromotion = true;
  else if (isPromotion === 'false') query.isPromotion = false;

  if (isNewProduct === 'true') query.isNewProduct = true;
  else if (isNewProduct === 'false') query.isNewProduct = false;

  if (isBestSeller === 'true') query.isBestSeller = true;
  else if (isBestSeller === 'false') query.isBestSeller = false;

  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  } else if (inStock === 'false') {
    query.stock = { $eq: 0 };
  }

  return query;
};

const buildProductSort = (sort) => {
  if (sort === 'price_asc') return { price: 1 };
  if (sort === 'price_desc') return { price: -1 };
  if (sort === 'best_seller') return { sold: -1 };
  if (sort === 'most_viewed') return { views: -1 };

  return { createdAt: -1 };
};

const getProducts = async (params) => {
  const query = buildProductQuery(params);
  const sortObj = buildProductSort(params.sort);
  const page = parsePositiveInt(params.page, 1);
  const limit = parsePositiveInt(params.limit, 8);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortObj).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const getProductById = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!product) {
    throw createServiceError('Product not found', 404);
  }

  return product;
};

const getNewProducts = async () => {
  return Product.find({ status: 'active', isNewProduct: true })
    .sort({ createdAt: -1 })
    .limit(8);
};

const getBestSellerProducts = async () => {
  return Product.find({ status: 'active', isBestSeller: true })
    .sort({ sold: -1 })
    .limit(8);
};

const getPromotionProducts = async () => {
  return Product.find({ status: 'active', isPromotion: true })
    .sort({ createdAt: -1 })
    .limit(8);
};

const getCategories = async () => {
  const categories = await Product.distinct('category', { status: 'active' });

  return categories.sort((firstCategory, secondCategory) =>
    firstCategory.localeCompare(secondCategory)
  );
};

const getTopBestSellers = async (limit = 10) => {
  const parsedLimit = parsePositiveInt(limit, 10);

  return Product.find({ status: 'active' })
    .sort({ sold: -1 })
    .limit(parsedLimit);
};

const getTopMostViewed = async (limit = 10) => {
  const parsedLimit = parsePositiveInt(limit, 10);

  return Product.find({ status: 'active' })
    .sort({ views: -1 })
    .limit(parsedLimit);
};

const getRelatedProducts = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw createServiceError('Product not found', 404);
  }

  return Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: 'active',
  }).limit(4);
};

module.exports = {
  getProducts,
  getProductById,
  getNewProducts,
  getBestSellerProducts,
  getPromotionProducts,
  getCategories,
  getTopBestSellers,
  getTopMostViewed,
  getRelatedProducts,
};
