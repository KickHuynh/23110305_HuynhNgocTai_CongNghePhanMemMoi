const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    isPromotion: {
      type: Boolean,
      default: false,
    },
    isNewProduct: { // Using isNewProduct instead of isNew to avoid conflict with Mongoose's internal isNew
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    rating: {
      type: Number,
      default: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    material: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug if not provided
productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
