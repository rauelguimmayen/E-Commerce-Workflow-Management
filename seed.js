/**
 * seed.js  –  Populate the ShopVibe database with sample data
 * Usage:  node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const PRODUCTS = [
  {
    name: 'SIHOO M18 Home-Style Gaming Chair',
    description: 'Premium Adjustable Headrest & Lumbar Support, Breathable Mesh High Back Computer Chair for Long Hours Comfort (Pure Black)',
    price: 9700,
    category: 'home',
    image_url: 'https://m.media-amazon.com/images/I/61Ed42wYJHL._AC_SL1500_.jpg',
    stock: 20,
    isActive: true,
    is_featured: true,
    tags: ['ergonomic', 'chair', 'swivel']
  },
  {
    name: 'Pro Runner Sneakers',
    description: 'Lightweight performance running shoes with responsive cushioning and breathable mesh upper.',
    price: 119.99,
    category: 'footwear',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    stock: 60,
    isActive: true,
    is_featured: true,
    tags: ['running', 'performance', 'mesh']
  },
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: '40-hour battery life with active noise cancellation. Premium drivers for studio-quality sound.',
    price: 249.99,
    category: 'electronics',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stock: 35,
    isActive: true,
    is_featured: true,
    tags: ['audio', 'wireless', 'anc']
  },
  {
    name: 'Leather Tote Bag',
    description: 'Full-grain leather tote with interior pockets, magnetic closure, and padded laptop sleeve.',
    price: 189.00,
    category: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    stock: 25,
    isActive: true,
    is_featured: true,
    tags: ['leather', 'bag', 'office']
  },
  {
    name: 'Smart Watch Series X',
    description: 'Track fitness, sleep, and notifications. AMOLED display, GPS, and 5-day battery.',
    price: 349.00,
    category: 'electronics',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    stock: 40,
    isActive: true,
    is_featured: true,
    tags: ['smartwatch', 'fitness', 'gps']
  },
  {
    name: 'Relaxed Linen Shorts',
    description: 'Breathable linen-blend shorts perfect for warm days. Elastic waistband with drawstring.',
    price: 44.99,
    category: 'clothing',
    image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80',
    stock: 80,
    isActive: true,
    is_featured: false,
    tags: ['linen', 'summer', 'casual']
  },
  {
    name: 'Minimalist Desk Lamp',
    description: 'Touch-dimming LED lamp with three color temperatures. USB-C charging port on the base.',
    price: 59.99,
    category: 'home',
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    stock: 55,
    isActive: true,
    is_featured: false,
    tags: ['desk', 'led', 'minimalist']
  },
  {
    name: 'Yoga Mat Pro',
    description: '6mm thick non-slip natural rubber yoga mat with alignment lines. Includes carry strap.',
    price: 79.00,
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80',
    stock: 70,
    isActive: true,
    is_featured: false,
    tags: ['yoga', 'fitness', 'rubber']
  },
  {
    name: 'Slim Bifold Wallet',
    description: 'RFID-blocking genuine leather wallet. Holds up to 8 cards with a central cash pocket.',
    price: 34.99,
    category: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    stock: 120,
    isActive: true,
    is_featured: true,
    tags: ['wallet', 'rfid', 'leather']
  },
  {
    name: 'Vintage Canvas Backpack',
    description: '22L waxed canvas backpack with padded laptop compartment and brass hardware.',
    price: 94.00,
    category: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    stock: 45,
    isActive: true,
    is_featured: false,
    tags: ['canvas', 'backpack', 'vintage']
  },
  {
    name: 'Oversized Hoodie',
    description: 'Garment-dyed fleece hoodie with kangaroo pocket. Pre-shrunk for lasting comfort.',
    price: 69.99,
    category: 'clothing',
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
    stock: 90,
    isActive: true,
    is_featured: false,
    tags: ['hoodie', 'fleece', 'oversized']
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound, IPX7 waterproof, 24-hour playtime. Ideal for outdoor adventures.',
    price: 89.99,
    category: 'electronics',
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    stock: 50,
    isActive: true,
    is_featured: false,
    tags: ['speaker', 'bluetooth', 'waterproof']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_STRING);
    console.log('✅  Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑   Cleared products');

    // Insert products
    const inserted = await Product.insertMany(PRODUCTS);
    console.log(`✅  Inserted ${inserted.length} products`);

    console.log('\n🎉  Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  }
}

seed();