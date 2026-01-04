# Features & Architecture

Complete overview of the ecommerce backend features and technical architecture.

## 🎯 Core Features

### 1. User Management & Authentication

#### Features
- **User Registration**: Email-based registration with validation
- **User Login**: JWT token-based authentication
- **Profile Management**: View and update user profile
- **Password Security**: bcrypt hashing with salt rounds
- **Role-Based Access**: User and Admin roles
- **Session Management**: JWT token with configurable expiration

#### Endpoints
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login and receive JWT token
GET    /api/auth/profile      - Get user profile (authenticated)
PUT    /api/auth/profile      - Update user profile (authenticated)
```

#### Technical Details
- JWT tokens with 7-day expiration (configurable)
- Password hashing with bcrypt (10 salt rounds)
- Token verification middleware
- Admin role verification

---

### 2. Product Management

#### Features
- **Product Catalog**: Full CRUD operations for products
- **Search & Filter**: Search by name, filter by category, price range
- **Pagination**: Efficient data loading with page/limit
- **Product Categories**: Electronics, Clothing, Books, Home, Sports, Toys
- **Featured Products**: Highlight special products
- **Product Specifications**: Flexible key-value pairs
- **Multiple Images**: Support for product image gallery
- **Stock Management**: Real-time inventory tracking
- **Product Views**: Track product popularity
- **Sales Tracking**: Monitor sold quantities

#### Endpoints
```
GET    /api/products                    - Get all products (with filters)
GET    /api/products/featured           - Get featured products
GET    /api/products/category/:category - Get products by category
GET    /api/products/:id                - Get single product
POST   /api/products                    - Create product (admin)
PUT    /api/products/:id                - Update product (admin)
DELETE /api/products/:id                - Soft delete product (admin)
```

#### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `search`: Text search (name, description, tags)
- `sort`: Sort field (e.g., -price, createdAt)
- `isFeatured`: Filter featured products

#### Technical Details
- MongoDB text indexes for search
- Composite indexes for performance
- Soft delete (isActive flag)
- Automatic view counting
- Image management with primary flag

---

### 3. Shopping Cart

#### Features
- **Cart Management**: Add, update, remove items
- **Session Persistence**: Cart tied to user account
- **Real-time Totals**: Auto-calculate item count and total price
- **Stock Validation**: Prevent overselling
- **Price Locking**: Capture price at time of add-to-cart
- **Clear Cart**: Remove all items at once

#### Endpoints
```
GET    /api/cart           - Get user's cart
POST   /api/cart           - Add item to cart
PUT    /api/cart/:itemId   - Update item quantity
DELETE /api/cart/:itemId   - Remove item from cart
DELETE /api/cart           - Clear entire cart
```

#### Technical Details
- One cart per user (unique constraint)
- Pre-save hooks calculate totals
- Populate product details automatically
- Stock validation on add/update
- Atomic operations for consistency

---

### 4. Order Processing

#### Features
- **Order Creation**: Convert cart to order with validation
- **Order Tracking**: Unique order numbers for easy reference
- **Order History**: View past orders with filtering
- **Order Status**: Track order lifecycle
- **Shipping Address**: Capture complete delivery information
- **Order Calculations**: Subtotal, tax (8%), shipping
- **Free Shipping**: Orders over $100
- **Admin Dashboard**: View all orders, update status
- **Analytics**: Order statistics and revenue tracking
- **Stock Management**: Automatic stock adjustment
- **Order Cancellation**: Restore stock on cancel

#### Order Statuses
- `pending`: Order placed, awaiting payment
- `processing`: Payment received, preparing order
- `shipped`: Order shipped to customer
- `delivered`: Order delivered successfully
- `cancelled`: Order cancelled, stock restored

#### Endpoints
```
POST   /api/orders                 - Create new order
GET    /api/orders                 - Get user's orders
GET    /api/orders/:id             - Get order details
GET    /api/orders/admin/all       - Get all orders (admin)
GET    /api/orders/admin/stats     - Get order statistics (admin)
PUT    /api/orders/:id/status      - Update order status (admin)
```

#### Calculations
```javascript
subtotal = sum(item.price × item.quantity)
tax = subtotal × 0.08 (8%)
shipping = subtotal > 100 ? 0 : 10
total = subtotal + tax + shipping
```

#### Technical Details
- Auto-generated order numbers
- Product snapshot in order (name, price, image)
- Stock adjustment on order/cancel
- Timestamps for status changes
- Aggregation pipeline for analytics

---

### 5. Payment Integration

#### Features
- **Stripe Integration**: Production-ready payment processing
- **Payment Intent**: For custom checkout flows
- **Checkout Session**: Hosted checkout page
- **Webhook Handling**: Automatic order status updates
- **Payment Tracking**: Transaction IDs and timestamps
- **Multiple Payment Methods**: Credit card, digital wallets
- **Test Mode**: Full test environment support

#### Endpoints
```
POST   /api/payments/create-intent          - Create payment intent
POST   /api/payments/create-checkout-session - Create checkout session
GET    /api/payments/status/:orderId        - Get payment status
POST   /api/payments/webhook                - Stripe webhook handler
```

#### Webhook Events
- `payment_intent.succeeded`: Update order status to processing
- `checkout.session.completed`: Mark payment as completed

#### Technical Details
- Stripe SDK integration
- Webhook signature verification
- Automatic order status updates
- Support for refunds (status: refunded)
- Line items with tax and shipping

---

### 6. Admin Features

#### Capabilities
- **Product Management**: Full CRUD operations
- **Order Management**: View all orders, update status
- **Analytics Dashboard**: Revenue, order statistics
- **User Management**: View user accounts
- **Inventory Control**: Monitor and update stock

#### Admin Endpoints
```
POST   /api/products                 - Create product
PUT    /api/products/:id             - Update product
DELETE /api/products/:id             - Delete product
GET    /api/orders/admin/all         - View all orders
GET    /api/orders/admin/stats       - Order analytics
PUT    /api/orders/:id/status        - Update order status
```

#### Analytics Provided
- Total orders
- Orders by status (pending, processing, shipped, delivered)
- Total revenue
- Average order value
- Date range filtering

---

## 🏗️ Technical Architecture

### Technology Stack

#### Backend Framework
- **Express.js 4.18+**: Fast, minimalist web framework
- **Node.js 14+**: JavaScript runtime

#### Database
- **MongoDB**: NoSQL document database
- **Mongoose 8.0+**: ODM for MongoDB

#### Authentication & Security
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **express-rate-limit**: API rate limiting
- **express-validator**: Input validation

#### Payment Processing
- **Stripe**: Payment gateway integration

#### Development Tools
- **Morgan**: HTTP request logger
- **dotenv**: Environment variable management
- **Nodemon**: Auto-restart for development

### Project Structure

```
project/
├── api/
│   └── index.js                    # Vercel serverless entry point
├── server/
│   ├── config/
│   │   └── database.js             # MongoDB connection & config
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── productController.js    # Product business logic
│   │   ├── cartController.js       # Cart operations
│   │   ├── orderController.js      # Order processing
│   │   └── paymentController.js    # Payment integration
│   ├── models/
│   │   ├── User.js                 # User schema & methods
│   │   ├── Product.js              # Product schema & indexes
│   │   ├── Cart.js                 # Cart schema & calculations
│   │   └── Order.js                # Order schema & hooks
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── productRoutes.js        # Product endpoints
│   │   ├── cartRoutes.js           # Cart endpoints
│   │   ├── orderRoutes.js          # Order endpoints
│   │   └── paymentRoutes.js        # Payment endpoints
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   ├── errorHandler.js         # Global error handling
│   │   └── validate.js             # Input validation
│   ├── utils/
│   │   ├── ApiError.js             # Custom error class
│   │   ├── ApiResponse.js          # Standard response format
│   │   ├── asyncHandler.js         # Async error wrapper
│   │   └── generateToken.js        # JWT utilities
│   ├── seeds/
│   │   └── seedData.js             # Database seeding script
│   └── app.js                      # Express app configuration
├── server.js                       # Local development server
├── vercel.json                     # Vercel deployment config
├── .env                            # Environment variables (not committed)
├── .env.example                    # Environment template
└── package.json                    # Dependencies & scripts
```

### Database Schema

#### User Schema
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  phone: String,
  role: String (enum: ['user', 'admin']),
  address: {
    street, city, state, zipCode, country
  },
  isActive: Boolean,
  timestamps: true
}
```

#### Product Schema
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  compareAtPrice: Number,
  category: String (enum, required),
  subcategory: String,
  brand: String,
  sku: String (unique),
  stock: Number (required),
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  specifications: Map<String, String>,
  tags: [String],
  isActive: Boolean,
  isFeatured: Boolean,
  ratings: {
    average: Number,
    count: Number
  },
  views: Number,
  soldCount: Number,
  timestamps: true
}
```

#### Cart Schema
```javascript
{
  user: ObjectId (ref: User, unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalItems: Number (auto-calculated),
  totalPrice: Number (auto-calculated),
  timestamps: true
}
```

#### Order Schema
```javascript
{
  user: ObjectId (ref: User),
  orderNumber: String (unique, auto-generated),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  shippingAddress: {
    firstName, lastName, email, phone,
    street, city, state, zipCode, country
  },
  paymentInfo: {
    method: String (enum),
    transactionId: String,
    status: String (enum),
    paidAt: Date
  },
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  totalAmount: Number,
  orderStatus: String (enum),
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  notes: String,
  timestamps: true
}
```

### API Response Format

#### Success Response
```javascript
{
  statusCode: 200,
  success: true,
  message: "Success message",
  data: {
    // Response data
  }
}
```

#### Error Response
```javascript
{
  success: false,
  statusCode: 400,
  message: "Error description",
  errors: [
    {
      field: "email",
      message: "Email is required"
    }
  ],
  stack: "Error stack (development only)"
}
```

### Middleware Chain

```
Request
  ↓
Helmet (Security Headers)
  ↓
CORS
  ↓
Morgan (Logging)
  ↓
JSON/URL Parser
  ↓
Rate Limiter
  ↓
Route Handler
  ↓
Authentication (if required)
  ↓
Validation (if required)
  ↓
Controller
  ↓
Response / Error Handler
  ↓
Client
```

### Security Features

1. **Authentication**
   - JWT tokens with expiration
   - Password hashing with bcrypt
   - Token verification middleware

2. **Authorization**
   - Role-based access control
   - Admin-only endpoints
   - Owner verification (cart, orders)

3. **Input Validation**
   - express-validator for all inputs
   - Schema validation with Mongoose
   - Sanitization of user inputs

4. **API Security**
   - Helmet for security headers
   - CORS configuration
   - Rate limiting (100 req/15min)
   - Error message sanitization

5. **Database Security**
   - Connection pooling
   - Parameterized queries (Mongoose)
   - Indexes for performance

### Performance Optimizations

1. **Database**
   - Indexes on frequently queried fields
   - Compound indexes for complex queries
   - Text indexes for search
   - Connection pooling

2. **Caching**
   - Serverless function keeps connections warm
   - Mongoose connection caching

3. **Pagination**
   - Limit/skip for large datasets
   - Default limits to prevent overload

4. **Query Optimization**
   - Lean queries where appropriate
   - Select only needed fields
   - Populate sparingly

### Deployment Architecture

#### Vercel Serverless
```
User Request
  ↓
Vercel Edge Network (CDN)
  ↓
Serverless Function (api/index.js)
  ↓
Express.js App
  ↓
MongoDB Atlas
  ↓
Response
```

#### Benefits
- Auto-scaling
- Global CDN
- Zero-downtime deployments
- Automatic HTTPS
- Environment isolation

### Error Handling Strategy

1. **Application Errors**: Custom ApiError class
2. **Validation Errors**: express-validator
3. **Database Errors**: Mongoose error handling
4. **Async Errors**: asyncHandler wrapper
5. **Unknown Routes**: 404 handler
6. **Global Handler**: Express error middleware

### Testing Strategy

1. **Manual Testing**: cURL commands provided
2. **API Testing**: Postman collection included
3. **Integration Testing**: Full workflow examples
4. **Production Testing**: Vercel preview deployments

### Monitoring & Logging

1. **Development**: Morgan HTTP logger
2. **Production**: Vercel logs
3. **Errors**: Console logging (extensible to Sentry)
4. **Database**: MongoDB Atlas monitoring
5. **Payments**: Stripe dashboard

### Scalability Considerations

1. **Horizontal Scaling**: Serverless auto-scales
2. **Database**: MongoDB Atlas clustering
3. **Caching**: Ready for Redis integration
4. **CDN**: Static assets can use CDN
5. **Rate Limiting**: Prevents abuse

### Future Enhancements

Potential features to add:

1. **Reviews & Ratings**: Product review system
2. **Wishlist**: Save favorite products
3. **Email Notifications**: Order confirmations
4. **Advanced Search**: Elasticsearch integration
5. **Image Upload**: Cloudinary/S3 integration
6. **Inventory Alerts**: Low stock notifications
7. **Discount Codes**: Coupon system
8. **Multiple Payment Methods**: PayPal, Apple Pay
9. **Shipping Integration**: Real-time shipping rates
10. **Multi-currency**: International support

### API Performance Metrics

Expected response times (95th percentile):
- Authentication: < 200ms
- Product listing: < 300ms
- Cart operations: < 200ms
- Order creation: < 500ms
- Payment processing: < 1000ms (Stripe API)

### Resource Requirements

#### Development
- Node.js 14+
- MongoDB (local or Atlas)
- 512MB RAM minimum

#### Production (Vercel)
- Serverless function: 1024MB
- Execution timeout: 10s
- Cold start: ~500ms

### Compliance & Standards

- **RESTful API**: Following REST principles
- **HTTP Status Codes**: Proper status code usage
- **JSON API**: Consistent JSON format
- **HTTPS**: Required in production
- **GDPR**: User data handling ready
- **PCI DSS**: Stripe handles card data

---

## 📊 Comparison with Alternatives

### vs. Traditional Monolith
✅ Better scalability
✅ Lower costs (pay per use)
✅ Zero-downtime deployments
❌ Cold start latency

### vs. Microservices
✅ Simpler architecture
✅ Faster development
✅ Lower complexity
❌ Less service isolation

### vs. Firebase/Supabase
✅ More control
✅ No vendor lock-in
✅ Custom business logic
❌ More setup required

---

This architecture provides a solid foundation for a production-grade ecommerce platform that can scale from MVP to thousands of users.
