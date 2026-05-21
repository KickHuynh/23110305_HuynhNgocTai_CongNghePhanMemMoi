require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDatabase = require('../config/database');

const products = [
  {
    name: "Nike Air Max 270",
    description: "The Nike Air Max 270 delivers visible air under every step. Updated for modern comfort, it nods to the original, 1991 Air Max 180 with its exaggerated tongue top and heritage tongue logo.",
    category: "Lifestyle",
    brand: "Nike",
    price: 150,
    salePrice: 120,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=800&q=80"
    ],
    stock: 45,
    sold: 120,
    views: 1200,
    sizes: ["39", "40", "41", "42"],
    colors: ["Red", "Black"],
    isPromotion: true,
    isNewProduct: false,
    isBestSeller: true,
    rating: 4.8,
    numReviews: 320,
    material: "Mesh",
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Say hello to supreme energy return. The Ultraboost 22 running shoes serve up comfort and responsiveness. You'll be riding on a BOOST midsole for endless energy.",
    category: "Running",
    brand: "Adidas",
    price: 190,
    salePrice: 190,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"
    ],
    stock: 30,
    sold: 85,
    views: 980,
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Black", "White"],
    isPromotion: false,
    isNewProduct: true,
    isBestSeller: false,
    rating: 4.9,
    numReviews: 210,
    material: "Primeknit",
  },
  {
    name: "Puma RS-X3",
    description: "X marks extreme. Exaggerated. Remixed. X3 takes things to a new level: cubed, enhanced, extra. We've taken the signature RS design and dialed it up to the third power.",
    category: "Lifestyle",
    brand: "Puma",
    price: 110,
    salePrice: 90,
    images: [
      "https://images.unsplash.com/photo-1606890658317-7d14490b76fc?w=800&q=80"
    ],
    stock: 60,
    sold: 45,
    views: 760,
    sizes: ["40", "41", "42"],
    colors: ["White", "Blue"],
    isPromotion: true,
    isNewProduct: false,
    isBestSeller: false,
    rating: 4.5,
    numReviews: 125,
    material: "Textile",
  },
  {
    name: "Converse Chuck Taylor All Star",
    description: "The Converse Chuck Taylor All Star High Top is the most iconic sneaker in the world, recognized for its unmistakable silhouette, star-centered ankle patch and cultural authenticity.",
    category: "Lifestyle",
    brand: "Converse",
    price: 65,
    salePrice: 65,
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80"
    ],
    stock: 100,
    sold: 500,
    views: 1980,
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Black", "White"],
    isPromotion: false,
    isNewProduct: false,
    isBestSeller: true,
    rating: 4.7,
    numReviews: 850,
    material: "Canvas",
  },
  {
    name: "New Balance 574",
    description: "The 574 was built to be a reliable shoe that could do a lot of different things well rather than as a platform for revolutionary technology, or as a premium materials showcase.",
    category: "Lifestyle",
    brand: "New Balance",
    price: 85,
    salePrice: 85,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80"
    ],
    stock: 40,
    sold: 150,
    views: 860,
    sizes: ["39", "40", "41", "42"],
    colors: ["Grey", "White"],
    isPromotion: false,
    isNewProduct: false,
    isBestSeller: true,
    rating: 4.6,
    numReviews: 240,
    material: "Suede",
  },
  {
    name: "Nike Air Force 1 '07",
    description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash.",
    category: "Lifestyle",
    brand: "Nike",
    price: 115,
    salePrice: 115,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"
    ],
    stock: 80,
    sold: 400,
    views: 1720,
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["White"],
    isPromotion: false,
    isNewProduct: false,
    isBestSeller: true,
    rating: 4.9,
    numReviews: 1200,
    material: "Leather",
  },
  {
    name: "Adidas NMD_R1",
    description: "Pack your bag, lace up and get going. City adventures beckon in these NMD_R1 shoes. An update to an acclaimed '80s runner from the adidas archive.",
    category: "Lifestyle",
    brand: "Adidas",
    price: 150,
    salePrice: 130,
    images: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80"
    ],
    stock: 25,
    sold: 90,
    views: 640,
    sizes: ["40", "41", "42", "43"],
    colors: ["Blue", "White"],
    isPromotion: true,
    isNewProduct: false,
    isBestSeller: false,
    rating: 4.4,
    numReviews: 180,
    material: "Knit",
  },
  {
    name: "Nike ZoomX Vaporfly",
    description: "Continue the next evolution of speed with a racing shoe made to help you chase new goals and records. The Nike ZoomX Vaporfly Next% 2 builds on the model racers everywhere love.",
    category: "Running",
    brand: "Nike",
    price: 250,
    salePrice: 250,
    images: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80"
    ],
    stock: 15,
    sold: 50,
    views: 910,
    sizes: ["39", "40", "41", "42"],
    colors: ["Orange", "Black"],
    isPromotion: false,
    isNewProduct: true,
    isBestSeller: false,
    rating: 4.9,
    numReviews: 75,
    material: "Mesh",
  },
  {
    name: "Puma MB.01",
    description: "LaMelo Ball’s first signature shoe, the MB.01, is a game-changer. Featuring PUMA Hoops technology, this basketball shoe is designed for explosive playmakers.",
    category: "Basketball",
    brand: "Puma",
    price: 125,
    salePrice: 125,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80" // Placeholder, reuse image
    ],
    stock: 20,
    sold: 110,
    views: 1330,
    sizes: ["41", "42", "43"],
    colors: ["Red", "Orange"],
    isPromotion: false,
    isNewProduct: true,
    isBestSeller: true,
    rating: 4.8,
    numReviews: 150,
    material: "Synthetic",
  },
  {
    name: "Nike Metcon 8",
    description: "You chase the clock, challenging and encouraging each other all in the name of achieving goals and making gains. Our go-to model for training.",
    category: "Training",
    brand: "Nike",
    price: 130,
    salePrice: 110,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" // Placeholder
    ],
    stock: 50,
    sold: 70,
    views: 540,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Grey", "Black"],
    isPromotion: true,
    isNewProduct: false,
    isBestSeller: false,
    rating: 4.7,
    numReviews: 220,
    material: "Mesh",
  },
  {
    name: "Adidas Harden Vol. 6",
    description: "Strike when your opponent least expects it. Drive to the hoop, pull up from deep and leave defenders in your wake—just like James Harden.",
    category: "Basketball",
    brand: "Adidas",
    price: 140,
    salePrice: 140,
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=800&q=80" // Placeholder
    ],
    stock: 35,
    sold: 60,
    views: 620,
    sizes: ["40", "41", "42", "43"],
    colors: ["Blue", "Orange"],
    isPromotion: false,
    isNewProduct: true,
    isBestSeller: false,
    rating: 4.5,
    numReviews: 95,
    material: "Textile",
  },
  {
    name: "New Balance Fresh Foam X",
    description: "The Fresh Foam X 1080v12 represents a consistent progression of the model's signature qualities. The smooth transitions of the pinnacle underfoot cushioning experience.",
    category: "Running",
    brand: "New Balance",
    price: 160,
    salePrice: 140,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80" // Placeholder
    ],
    stock: 40,
    sold: 130,
    views: 1140,
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Black", "White"],
    isPromotion: true,
    isNewProduct: false,
    isBestSeller: true,
    rating: 4.8,
    numReviews: 310,
    material: "Knit",
  }
];

const VND_PRICE_MULTIPLIER = 10000;

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const normalizedProducts = products.map((product) => ({
  ...product,
  slug: generateSlug(product.name),
  price: product.price * VND_PRICE_MULTIPLIER,
  salePrice: product.salePrice * VND_PRICE_MULTIPLIER,
}));

const seedProducts = async () => {
  try {
    await connectDatabase();
    
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('Seeding new products...');
    await Product.insertMany(normalizedProducts);
    
    console.log('Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
