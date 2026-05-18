const Product = require('../models/Product');

// Get all products with filtering and sorting
exports.getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      sort,
      inStock,
      isPromotion,
      isNewProduct,
      isBestSeller,
    } = req.query;

    let query = { status: 'active' };

    // Search by keyword (name or description)
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

    // Price filtering (using price, simpler logic)
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

    // Sorting
    let sortObj = { createdAt: -1 }; // Default newest
    if (sort === 'newest') sortObj = { createdAt: -1 };
    else if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'best_seller') sortObj = { sold: -1 };

    const products = await Product.find(query).sort(sortObj);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
};

// Get new products
exports.getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active', isNewProduct: true })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      message: 'New products retrieved successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve new products',
      error: error.message,
    });
  }
};

// Get best seller products
exports.getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active', isBestSeller: true })
      .sort({ sold: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      message: 'Best seller products retrieved successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve best seller products',
      error: error.message,
    });
  }
};

// Get promotion products
exports.getPromotionProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active', isPromotion: true })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      message: 'Promotion products retrieved successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve promotion products',
      error: error.message,
    });
  }
};

// Get related products
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
    }).limit(4);

    res.status(200).json({
      success: true,
      message: 'Related products retrieved successfully',
      data: relatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve related products',
      error: error.message,
    });
  }
};
