require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');

const seedUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '1234567890',
    address: {
      street: '123 Admin St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
    },
  },
  {
    email: 'user@example.com',
    password: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    phone: '9876543210',
    address: {
      street: '456 User Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'US',
    },
  },
];

const seedProducts = [
  {
    name: 'MacBook Pro 16"',
    description: 'Apple MacBook Pro 16-inch with M2 Pro chip, 16GB RAM, 512GB SSD. Perfect for professionals and creators.',
    price: 2499.99,
    compareAtPrice: 2799.99,
    category: 'electronics',
    subcategory: 'laptops',
    brand: 'Apple',
    sku: 'MBP16-M2PRO-001',
    stock: 25,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        alt: 'MacBook Pro 16 inch',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['processor', 'Apple M2 Pro'],
      ['ram', '16GB Unified Memory'],
      ['storage', '512GB SSD'],
      ['display', '16.2-inch Liquid Retina XDR'],
      ['graphics', 'Integrated 19-core GPU'],
    ]),
    tags: ['laptop', 'apple', 'macbook', 'professional', 'creator'],
    isFeatured: true,
  },
  {
    name: 'iPhone 15 Pro',
    description: 'iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system. Available in Natural Titanium.',
    price: 999.99,
    compareAtPrice: 1099.99,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Apple',
    sku: 'IP15PRO-128-NAT',
    stock: 50,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592286927505-c0d6e3a0bfe8',
        alt: 'iPhone 15 Pro',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['processor', 'A17 Pro chip'],
      ['storage', '128GB'],
      ['display', '6.1-inch Super Retina XDR'],
      ['camera', 'Triple camera system'],
      ['battery', 'All-day battery life'],
    ]),
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    isFeatured: true,
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality and comfort.',
    price: 399.99,
    category: 'electronics',
    subcategory: 'audio',
    brand: 'Sony',
    sku: 'WH1000XM5-BLK',
    stock: 100,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
        alt: 'Sony WH-1000XM5 Headphones',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['type', 'Over-ear wireless'],
      ['noise_canceling', 'Yes'],
      ['battery', 'Up to 30 hours'],
      ['connectivity', 'Bluetooth 5.2'],
    ]),
    tags: ['headphones', 'wireless', 'noise-canceling', 'audio'],
    isFeatured: true,
  },
  {
    name: 'Nike Air Max 90',
    description: 'Classic Nike Air Max 90 sneakers with iconic design and superior comfort. Perfect for everyday wear.',
    price: 129.99,
    category: 'clothing',
    subcategory: 'shoes',
    brand: 'Nike',
    sku: 'AM90-WHT-10',
    stock: 75,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        alt: 'Nike Air Max 90',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['size', '10 US'],
      ['color', 'White/Black'],
      ['material', 'Leather and mesh'],
    ]),
    tags: ['shoes', 'sneakers', 'nike', 'athletic'],
  },
  {
    name: 'Samsung 55" QLED 4K TV',
    description: 'Quantum Dot technology delivers brilliant color and exceptional detail. Smart TV with built-in streaming apps.',
    price: 799.99,
    compareAtPrice: 999.99,
    category: 'electronics',
    subcategory: 'televisions',
    brand: 'Samsung',
    sku: 'QN55Q60C',
    stock: 30,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
        alt: 'Samsung QLED TV',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['screen_size', '55 inches'],
      ['resolution', '4K Ultra HD'],
      ['hdr', 'HDR10+'],
      ['smart_tv', 'Yes'],
    ]),
    tags: ['tv', 'television', 'samsung', '4k', 'smart-tv'],
    isFeatured: true,
  },
  {
    name: 'Kindle Paperwhite',
    description: 'Waterproof e-reader with a glare-free display. Enjoy reading like real paper, even in bright sunlight.',
    price: 139.99,
    category: 'electronics',
    subcategory: 'e-readers',
    brand: 'Amazon',
    sku: 'KPW-2023-8GB',
    stock: 120,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666',
        alt: 'Kindle Paperwhite',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['display', '6.8-inch glare-free'],
      ['storage', '8GB'],
      ['waterproof', 'IPX8'],
      ['battery', 'Up to 10 weeks'],
    ]),
    tags: ['e-reader', 'kindle', 'books', 'reading'],
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-functional pressure cooker combines 7 kitchen appliances in one. Perfect for quick and easy meals.',
    price: 89.99,
    category: 'home',
    subcategory: 'kitchen',
    brand: 'Instant Pot',
    sku: 'IP-DUO60-V3',
    stock: 60,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585515320310-259814833e62',
        alt: 'Instant Pot',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['capacity', '6 Quart'],
      ['functions', '7-in-1'],
      ['programs', '14 Smart Programs'],
    ]),
    tags: ['kitchen', 'cooking', 'pressure-cooker', 'appliance'],
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with superior cushioning and grip. Perfect for yoga, pilates, and stretching.',
    price: 34.99,
    category: 'sports',
    subcategory: 'fitness',
    brand: 'BalanceFrom',
    sku: 'YM-PRO-BLK',
    stock: 200,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
        alt: 'Yoga Mat',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['thickness', '1/2 inch'],
      ['material', 'NBR foam'],
      ['dimensions', '71" x 24"'],
    ]),
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
  },
  {
    name: 'LEGO Star Wars Millennium Falcon',
    description: 'Build and display the iconic Millennium Falcon. This detailed model features 7,541 pieces.',
    price: 849.99,
    category: 'toys',
    subcategory: 'building-sets',
    brand: 'LEGO',
    sku: 'LEGO-75192',
    stock: 15,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
        alt: 'LEGO Millennium Falcon',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['pieces', '7,541'],
      ['age', '16+'],
      ['dimensions', '33" x 22" x 8"'],
    ]),
    tags: ['lego', 'star-wars', 'building', 'collectible'],
    isFeatured: true,
  },
  {
    name: 'The Lean Startup Book',
    description: 'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses by Eric Ries.',
    price: 16.99,
    category: 'books',
    subcategory: 'business',
    brand: 'Crown Business',
    sku: 'BOOK-TLS-001',
    stock: 150,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
        alt: 'The Lean Startup',
        isPrimary: true,
      },
    ],
    specifications: new Map([
      ['author', 'Eric Ries'],
      ['pages', '336'],
      ['format', 'Hardcover'],
      ['publisher', 'Crown Business'],
    ]),
    tags: ['book', 'business', 'entrepreneurship', 'startup'],
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('Seeding users...');
    const users = await User.insertMany(seedUsers);
    console.log(`✓ ${users.length} users created`);

    console.log('Seeding products...');
    const products = await Product.insertMany(seedProducts);
    console.log(`✓ ${products.length} products created`);

    console.log('\n=================================');
    console.log('Database seeded successfully! 🌱');
    console.log('=================================\n');
    console.log('Test Accounts:');
    console.log('Admin:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123\n');
    console.log('User:');
    console.log('  Email: user@example.com');
    console.log('  Password: user123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
