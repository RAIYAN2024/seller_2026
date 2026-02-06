# 🛒 Ecommerce Backend API - Complete Production-Ready Solution

A fully-featured, production-ready ecommerce backend built with **Express.js** and **MongoDB**, optimized for **Vercel serverless deployment**.

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-blueviolet.svg)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Seed database with sample data
npm run seed

# 4. Start server
npm run server

# 5. Test API
curl http://localhost:3001/api
```

**That's it!** Your ecommerce backend is running on `http://localhost:3001`

### Default Test Accounts (after seeding)
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## ✨ Features

### Core Functionality
- ✅ **User Authentication** - JWT-based with bcrypt password hashing
- ✅ **Product Management** - Full CRUD with search, filtering, pagination
- ✅ **Shopping Cart** - Session-based cart with real-time calculations
- ✅ **Order Processing** - Complete order lifecycle management
- ✅ **Payment Integration** - Stripe payment processing with webhooks
- ✅ **Admin Dashboard** - Product & order management, analytics

### Security & Performance
- 🔒 **Helmet** - Security headers
- 🔒 **CORS** - Configurable cross-origin requests
- 🔒 **Rate Limiting** - Prevent API abuse (100 req/15min)
- 🔒 **Input Validation** - express-validator on all endpoints
- ⚡ **MongoDB Indexes** - Optimized database queries
- ⚡ **Pagination** - Efficient data loading

### Developer Experience
- 📦 **Serverless Ready** - Optimized for Vercel deployment
- 📚 **Comprehensive Documentation** - API docs, testing guide, deployment guide
- 🧪 **Testing Ready** - Postman collection included
- 🌱 **Database Seeding** - Sample data for quick testing
- 🔧 **Error Handling** - Consistent error responses

## 📁 Project Structure

```
project/
├── api/index.js                    # Vercel serverless entry point
├── server/
│   ├── app.js                      # Express app configuration
│   ├── config/database.js          # MongoDB connection
│   ├── controllers/                # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── models/                     # Database schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/                     # API endpoints
│   ├── middleware/                 # Auth, validation, errors
│   ├── utils/                      # Helper functions
│   └── seeds/                      # Database seeding
├── server.js                       # Local development server
├── vercel.json                     # Vercel deployment config
├── .env.example                    # Environment template
└── package.json                    # Dependencies
```

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login and get JWT token
GET    /api/auth/profile      Get user profile (auth required)
PUT    /api/auth/profile      Update user profile (auth required)
```

### Products
```
GET    /api/products                    Get all products (with filters)
GET    /api/products/featured           Get featured products
GET    /api/products/category/:category Get products by category
GET    /api/products/:id                Get single product
POST   /api/products                    Create product (admin only)
PUT    /api/products/:id                Update product (admin only)
DELETE /api/products/:id                Delete product (admin only)
```

### Shopping Cart
```
GET    /api/cart           Get user's cart
POST   /api/cart           Add item to cart
PUT    /api/cart/:itemId   Update item quantity
DELETE /api/cart/:itemId   Remove item from cart
DELETE /api/cart           Clear entire cart
```

### Orders
```
POST   /api/orders                 Create order
GET    /api/orders                 Get user's orders
GET    /api/orders/:id             Get order details
GET    /api/orders/admin/all       Get all orders (admin)
GET    /api/orders/admin/stats     Get order statistics (admin)
PUT    /api/orders/:id/status      Update order status (admin)
```

### Payments
```
POST   /api/payments/create-intent          Create payment intent
POST   /api/payments/create-checkout-session Create Stripe checkout
GET    /api/payments/status/:orderId        Get payment status
POST   /api/payments/webhook                Stripe webhook handler
```

## 📖 Complete Documentation

This project includes comprehensive documentation:

1. **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
2. **[ECOMMERCE_BACKEND_README.md](ECOMMERCE_BACKEND_README.md)** - Complete API documentation
3. **[API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)** - Testing examples and cURL commands
4. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deploy to Vercel, Heroku, AWS
5. **[FEATURES_AND_ARCHITECTURE.md](FEATURES_AND_ARCHITECTURE.md)** - Technical deep dive

### Quick Reference

#### Example: Register & Login
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### Example: Get Products
```bash
# All products
curl http://localhost:3001/api/products

# Filter by category and price
curl "http://localhost:3001/api/products?category=electronics&minPrice=100&maxPrice=500"

# Search
curl "http://localhost:3001/api/products?search=laptop"
```

#### Example: Add to Cart
```bash
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

## 🚀 Deploy to Vercel

### One-Command Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Environment Variables (Set in Vercel Dashboard)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your-secret-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGIN=https://your-frontend.com
NODE_ENV=production
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete instructions.

## 🛠️ Technology Stack

- **Runtime**: Node.js 14+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Payment**: Stripe API
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator
- **Development**: Nodemon, Morgan (logging)

## 📦 Installation

### Prerequisites

- Node.js 14 or higher
- MongoDB (local or MongoDB Atlas)
- Stripe account (for payments)

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd project

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Seed database (optional)
npm run seed

# Start development server
npm run server:dev

# Or start production server
npm run server
```

## 🧪 Testing

### Test with cURL (examples in API_TESTING_GUIDE.md)
```bash
curl http://localhost:3001/api
```

### Test with Postman
1. Import `Ecommerce_API.postman_collection.json`
2. Set `baseUrl` to `http://localhost:3001`
3. Test all endpoints

### Test Complete Flow
1. Register user → Get token
2. Browse products → Get product list
3. Add to cart → Add items
4. Create order → Submit order
5. Process payment → Stripe checkout

## 📊 Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: 'user' | 'admin',
  address: Object,
  isActive: Boolean
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  images: Array,
  specifications: Map,
  tags: Array,
  isFeatured: Boolean,
  ratings: Object
}
```

### Order
```javascript
{
  user: ObjectId,
  orderNumber: String (unique),
  items: Array,
  shippingAddress: Object,
  paymentInfo: Object,
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  totalAmount: Number,
  orderStatus: String
}
```

## 🔐 Security

- ✅ JWT authentication with token expiration
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS protection (Helmet)
- ✅ CORS configuration
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Error message sanitization

## 🎨 Frontend Integration

Works with any frontend framework:

### React/Next.js Example
```javascript
const API_URL = 'http://localhost:3001/api';

// Login
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

// Get products
const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return await response.json();
};
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts

```bash
npm run dev          # Start Next.js frontend
npm run server       # Start backend server
npm run server:dev   # Start backend with auto-reload
npm run seed         # Seed database with sample data
npm run build        # Build Next.js for production
npm start            # Start Next.js production server
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env`
- Check MongoDB is running (local) or network access (Atlas)
- Ensure credentials are correct

### JWT Token Error
- Check `JWT_SECRET` is set
- Verify token format: `Bearer TOKEN`
- Token may be expired - login again

### Stripe Error
- Use test keys (start with `sk_test_`)
- Verify webhook secret
- Check Stripe dashboard for errors

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for more troubleshooting.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the database
- Stripe team for payment processing
- All open-source contributors

## 📞 Support

For issues and questions:
- 📖 Check documentation files
- 🐛 Open an issue on GitHub
- 💬 Join our community discussions

## 🎉 What's Included

This complete package includes:

✅ **Backend Server** - Production-ready Express.js API  
✅ **Database Models** - User, Product, Cart, Order schemas  
✅ **Authentication System** - JWT-based auth with roles  
✅ **Payment Integration** - Stripe with webhooks  
✅ **Admin Features** - Product & order management  
✅ **Security Features** - Helmet, CORS, rate limiting  
✅ **Documentation** - 5 comprehensive guides  
✅ **Testing Tools** - Postman collection, cURL examples  
✅ **Seed Data** - 10 sample products, test accounts  
✅ **Deployment Config** - Vercel-ready configuration  
✅ **Error Handling** - Consistent error responses  
✅ **Input Validation** - All endpoints validated  

## 🚀 Next Steps

1. ✅ Read [QUICK_START.md](QUICK_START.md) to get started
2. ✅ Test APIs with [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)
3. ✅ Deploy with [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
4. ✅ Understand architecture in [FEATURES_AND_ARCHITECTURE.md](FEATURES_AND_ARCHITECTURE.md)
5. ✅ Build your frontend and integrate!

---

**Built with ❤️ using Express.js, MongoDB, and Stripe**

**Ready to deploy. Ready to scale. Ready for production.** 🚀
