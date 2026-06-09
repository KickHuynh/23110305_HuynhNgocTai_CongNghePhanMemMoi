const Product = require('../models/Product');
const mongoose = require('mongoose');

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

// Cho phép tìm sản phẩm theo ObjectId hoặc slug trên cùng một endpoint.
const resolveProductFilter = (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return {
      $or: [{ _id: identifier }, { slug: identifier }],
    };
  }

  return { slug: identifier };
};

// Chuyển các tham số lọc từ query string thành điều kiện truy vấn MongoDB.
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

// Chuyển lựa chọn sắp xếp của client thành thứ tự truy vấn phù hợp.
const buildProductSort = (sort) => {
  if (sort === 'price_asc') return { price: 1 };
  if (sort === 'price_desc') return { price: -1 };
  if (sort === 'best_seller') return { sold: -1 };
  if (sort === 'most_viewed') return { views: -1 };

  return { createdAt: -1 };
};

// Lấy danh sách sản phẩm theo bộ lọc, sắp xếp và phân trang.
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

// Lấy chi tiết sản phẩm và tăng bộ đếm lượt xem cho trang chi tiết.
const getProductById = async (productId) => {
  const product = await Product.findOneAndUpdate(
    resolveProductFilter(productId),
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!product) {
    throw createServiceError('Product not found', 404);
  }

  return product;
};

// Lấy các sản phẩm được đánh dấu là mới.
const getNewProducts = async () => {
  return Product.find({ status: 'active', isNewProduct: true })
    .sort({ createdAt: -1 })
    .limit(8);
};

// Lấy các sản phẩm được đánh dấu là bán chạy.
const getBestSellerProducts = async () => {
  return Product.find({ status: 'active', isBestSeller: true })
    .sort({ sold: -1 })
    .limit(8);
};

// Lấy các sản phẩm đang bật cờ khuyến mãi.
const getPromotionProducts = async () => {
  return Product.find({ status: 'active', isPromotion: true })
    .sort({ createdAt: -1 })
    .limit(8);
};

// Lấy danh mục đang hoạt động để frontend dựng bộ lọc.
const getCategories = async () => {
  const categories = await Product.distinct('category', { status: 'active' });

  return categories.sort((firstCategory, secondCategory) =>
    firstCategory.localeCompare(secondCategory)
  );
};

// Lấy top sản phẩm bán chạy theo giới hạn được yêu cầu.
const getTopBestSellers = async (limit = 10) => {
  const parsedLimit = parsePositiveInt(limit, 10);

  return Product.find({ status: 'active' })
    .sort({ sold: -1 })
    .limit(parsedLimit);
};

// Lấy top sản phẩm có lượt xem cao nhất theo giới hạn được yêu cầu.
const getTopMostViewed = async (limit = 10) => {
  const parsedLimit = parsePositiveInt(limit, 10);

  return Product.find({ status: 'active' })
    .sort({ views: -1 })
    .limit(parsedLimit);
};

// Lấy các sản phẩm cùng danh mục để gợi ý ở trang chi tiết.
const getRelatedProducts = async (productId) => {
  const product = await Product.findOne(resolveProductFilter(productId));

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
