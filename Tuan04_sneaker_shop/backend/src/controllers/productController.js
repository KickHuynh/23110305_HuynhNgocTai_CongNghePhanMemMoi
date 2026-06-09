const productService = require('../services/productService');

// Trả lỗi nghiệp vụ sản phẩm theo cùng một định dạng JSON.
const handleError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.publicMessage || fallbackMessage,
    error: error.message,
  });
};

// Lấy danh sách sản phẩm có hỗ trợ lọc, sắp xếp và phân trang.
exports.getProducts = async (req, res) => {
  try {
    const data = await productService.getProducts(req.query);

    return res.status(200).json({
      success: true,
      message: 'Get products successfully',
      data,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve products');
  }
};

// Lấy chi tiết một sản phẩm theo id hoặc slug.
exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve product');
  }
};

// Lấy danh sách danh mục sản phẩm đang hoạt động.
exports.getCategories = async (req, res) => {
  try {
    const categories = await productService.getCategories();

    return res.status(200).json({
      success: true,
      message: 'Get categories successfully',
      data: categories,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve categories');
  }
};

// Lấy các sản phẩm mới để hiển thị trên trang chủ.
exports.getNewProducts = async (req, res) => {
  try {
    const products = await productService.getNewProducts();

    return res.status(200).json({
      success: true,
      message: 'New products retrieved successfully',
      data: products,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve new products');
  }
};

// Lấy các sản phẩm được gắn cờ bán chạy.
exports.getBestSellerProducts = async (req, res) => {
  try {
    const products = await productService.getBestSellerProducts();

    return res.status(200).json({
      success: true,
      message: 'Best seller products retrieved successfully',
      data: products,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve best seller products');
  }
};

// Lấy các sản phẩm đang có khuyến mãi.
exports.getPromotionProducts = async (req, res) => {
  try {
    const products = await productService.getPromotionProducts();

    return res.status(200).json({
      success: true,
      message: 'Promotion products retrieved successfully',
      data: products,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve promotion products');
  }
};

// Lấy top sản phẩm bán chạy theo giới hạn client yêu cầu.
exports.getTopBestSellers = async (req, res) => {
  try {
    const products = await productService.getTopBestSellers(req.query.limit);

    return res.status(200).json({
      success: true,
      message: 'Get top best selling products successfully',
      data: products,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve top best selling products');
  }
};

// Lấy top sản phẩm có nhiều lượt xem nhất.
exports.getTopMostViewed = async (req, res) => {
  try {
    const products = await productService.getTopMostViewed(req.query.limit);

    return res.status(200).json({
      success: true,
      message: 'Get top most viewed products successfully',
      data: products,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve top most viewed products');
  }
};

// Lấy danh sách sản phẩm liên quan để gợi ý ở trang chi tiết.
exports.getRelatedProducts = async (req, res) => {
  try {
    const relatedProducts = await productService.getRelatedProducts(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Related products retrieved successfully',
      data: relatedProducts,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve related products');
  }
};
