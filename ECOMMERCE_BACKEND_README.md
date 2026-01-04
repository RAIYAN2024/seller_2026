# Ecommerce Backend API

A complete, production-ready ecommerce backend server built with Express.js, optimized for Vercel serverless deployment.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Product Management**: Full CRUD operations with filtering, search, and pagination
- **Shopping Cart**: Session-based cart management
- **Order Processing**: Complete order lifecycle management
- **Payment Integration**: Stripe payment processing with webhooks
- **Admin Dashboard**: Admin endpoints for managing products, orders, and analytics
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: MongoDB with Mongoose ODM
- **Serverless Ready**: Optimized for Vercel deployment

## 📁 Project Structure

```
.
├── api/
│   └── index.js                 # Vercel serverless entry point
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product management
│   │   ├── cartController.js    # Cart operations
│   │   ├── orderController.js   # Order processing
│   │   └── paymentController.js # Payment integration
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Cart.js              # Cart schema
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   ├── cartRoutes.js        # Cart endpoints
│   │   ├── orderRoutes.js       # Order endpoints
│   │   └── paymentRoutes.js     # Payment endpoints
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── errorHandler.js      # Error handling
│   │   └── validate.js          # Input validation
│   ├── utils/
│   │   ├── ApiError.js          # Custom error class
│   │   ├── ApiResponse.js       # Standard response format
│   │   ├── asyncHandler.js      # Async error wrapper
│   │   └── generateToken.js     # JWT token utilities
│   └── app.js                   # Express app configuration
├── server.js                    # Local development server
├── vercel.json                  # Vercel deployment config
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies
```

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Stripe account (for payment processing)

### Setup

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration**
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

## 📦 Dependencies

Install all required dependencies:

```bash
npm install express mongoose dotenv jsonwebtoken bcryptjs stripe cors helmet express-rate-limit express-validator morgan
```

## 🌐 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |

#### Example: Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Example: Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products (with filters) | No |
| GET | `/featured` | Get featured products | No |
| GET | `/category/:category` | Get products by category | No |
| GET | `/:id` | Get product by ID | No |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

#### Example: Get Products
```bash
# Get all products
curl http://localhost:3001/api/products

# Filter by category and price
curl "http://localhost:3001/api/products?category=electronics&minPrice=100&maxPrice=500"

# Search products
curl "http://localhost:3001/api/products?search=laptop"
```

#### Example: Create Product (Admin)
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "electronics",
    "stock": 50,
    "images": [
      {
        "url": "https://example.com/laptop.jpg",
        "alt": "Laptop",
        "isPrimary": true
      }
    ]
  }'
```

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's cart | Yes |
| POST | `/` | Add item to cart | Yes |
| PUT | `/:itemId` | Update cart item quantity | Yes |
| DELETE | `/:itemId` | Remove item from cart | Yes |
| DELETE | `/` | Clear cart | Yes |

#### Example: Add to Cart
```bash
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "product_id_here",
    "quantity": 2
  }'
```

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create order | Yes |
| GET | `/` | Get user orders | Yes |
| GET | `/:id` | Get order details | Yes |
| GET | `/admin/all` | Get all orders | Admin |
| GET | `/admin/stats` | Get order statistics | Admin |
| PUT | `/:id/status` | Update order status | Admin |

#### Example: Create Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "product": "product_id_here",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    },
    "paymentMethod": "stripe"
  }'
```

### Payments (`/api/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create-intent` | Create payment intent | Yes |
| POST | `/create-checkout-session` | Create Stripe checkout session | Yes |
| GET | `/status/:orderId` | Get payment status | Yes |
| POST | `/webhook` | Stripe webhook handler | No |

#### Example: Create Checkout Session
```bash
curl -X POST http://localhost:3001/api/payments/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderId": "order_id_here",
    "successUrl": "http://localhost:3000/success",
    "cancelUrl": "http://localhost:3000/cancel"
  }'
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [],
  "stack": "Error stack (development only)"
}
```

## 🚀 Deployment to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Set Environment Variables

In your Vercel dashboard, add the following environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN`
- `NODE_ENV=production`

### 5. Configure Stripe Webhook

After deployment, configure your Stripe webhook URL:
```
https://your-domain.vercel.app/api/payments/webhook
```

Select the following events:
- `payment_intent.succeeded`
- `checkout.session.completed`

## 🧪 Testing

### Using cURL

Test the health endpoint:
```bash
curl http://localhost:3001/api
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables for `BASE_URL` and `TOKEN`
3. Test each endpoint

### Using JavaScript/Fetch

```javascript
// Register user
const registerUser = async () => {
  const response = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    }),
  });
  const data = await response.json();
  console.log(data);
};

// Get products
const getProducts = async () => {
  const response = await fetch('http://localhost:3001/api/products');
  const data = await response.json();
  console.log(data);
};

// Add to cart (requires auth token)
const addToCart = async (token) => {
  const response = await fetch('http://localhost:3001/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId: 'product_id_here',
      quantity: 1,
    }),
  });
  const data = await response.json();
  console.log(data);
};
```

## 📝 Database Seeding

Create a seed file to populate your database with sample data:

```javascript
// seeds/seedData.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../server/config/database');
const User = require('../server/models/User');
const Product = require('../server/models/Product');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Product.deleteMany({});

  // Create admin user
  await User.create({
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  });

  // Create sample products
  await Product.insertMany([
    {
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      category: 'electronics',
      stock: 50,
      images: [{ url: 'https://example.com/laptop.jpg', isPrimary: true }],
    },
    // Add more products...
  ]);

  console.log('Data seeded successfully');
  process.exit();
};

seedData();
```

Run: `node seeds/seedData.js`

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents abuse and DDoS
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: express-validator
- **Error Handling**: Secure error messages

## 🎯 Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **Error Handling**: All async operations wrapped in try-catch
3. **Validation**: Input validation on all endpoints
4. **Authentication**: Protected routes require valid JWT
5. **Database**: Indexes on frequently queried fields
6. **Logging**: Morgan for request logging in development
7. **Rate Limiting**: Prevents API abuse

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` in `.env`
- Check network access in MongoDB Atlas
- Ensure IP address is whitelisted

### Authentication Errors
- Verify `JWT_SECRET` is set
- Check token expiration
- Ensure Bearer token format

### Stripe Integration Issues
- Verify Stripe keys (test/production)
- Check webhook signature
- Test with Stripe CLI: `stripe listen --forward-to localhost:3001/api/payments/webhook`

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [JWT.io](https://jwt.io/)
- [Vercel Documentation](https://vercel.com/docs)

## 📄 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📧 Support

For issues and questions:
- Create an issue in the repository
- Email: support@example.com

---

Built with ❤️ using Express.js and MongoDB
