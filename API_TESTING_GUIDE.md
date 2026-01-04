# API Testing Guide

This guide provides comprehensive testing examples for all API endpoints.

## Quick Start

1. Start the server: `npm run server`
2. Server will be available at: `http://localhost:3001`
3. Test the health endpoint: `curl http://localhost:3001/api`

## Authentication Flow

### 1. Register a New User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "1234567890"
  }'
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Save the token for authenticated requests!

### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile

```bash
curl http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Update Profile

```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "phone": "9876543210",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    }
  }'
```

## Product Management

### 1. Get All Products

```bash
# Basic request
curl http://localhost:3001/api/products

# With pagination
curl "http://localhost:3001/api/products?page=1&limit=10"

# Filter by category
curl "http://localhost:3001/api/products?category=electronics"

# Filter by price range
curl "http://localhost:3001/api/products?minPrice=100&maxPrice=500"

# Search products
curl "http://localhost:3001/api/products?search=laptop"

# Get featured products only
curl "http://localhost:3001/api/products?isFeatured=true"

# Combine filters
curl "http://localhost:3001/api/products?category=electronics&minPrice=200&maxPrice=1000&sort=-price"
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### 2. Get Featured Products

```bash
curl http://localhost:3001/api/products/featured
```

### 3. Get Products by Category

```bash
curl http://localhost:3001/api/products/category/electronics
```

### 4. Get Single Product

```bash
curl http://localhost:3001/api/products/PRODUCT_ID
```

### 5. Create Product (Admin Only)

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "MacBook Pro 16",
    "description": "High-performance laptop for professionals",
    "price": 2499.99,
    "compareAtPrice": 2799.99,
    "category": "electronics",
    "subcategory": "laptops",
    "brand": "Apple",
    "sku": "MBP16-001",
    "stock": 25,
    "images": [
      {
        "url": "https://example.com/macbook-pro-16.jpg",
        "alt": "MacBook Pro 16 inch",
        "isPrimary": true
      }
    ],
    "specifications": {
      "processor": "Apple M2 Pro",
      "ram": "16GB",
      "storage": "512GB SSD",
      "display": "16-inch Retina"
    },
    "tags": ["laptop", "apple", "macbook", "professional"],
    "isFeatured": true
  }'
```

### 6. Update Product (Admin Only)

```bash
curl -X PUT http://localhost:3001/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "price": 2399.99,
    "stock": 30
  }'
```

### 7. Delete Product (Admin Only)

```bash
curl -X DELETE http://localhost:3001/api/products/PRODUCT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Shopping Cart

### 1. Get Cart

```bash
curl http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Add Item to Cart

```bash
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

### 3. Update Cart Item Quantity

```bash
curl -X PUT http://localhost:3001/api/cart/CART_ITEM_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 3
  }'
```

### 4. Remove Item from Cart

```bash
curl -X DELETE http://localhost:3001/api/cart/CART_ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Clear Cart

```bash
curl -X DELETE http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Order Management

### 1. Create Order

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID_1",
        "quantity": 2
      },
      {
        "product": "PRODUCT_ID_2",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    },
    "paymentMethod": "stripe",
    "notes": "Please deliver in the morning"
  }'
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "_id": "...",
      "orderNumber": "ORD-1234567890-ABC123",
      "items": [...],
      "subtotal": 199.98,
      "tax": 15.99,
      "shippingCost": 10.00,
      "totalAmount": 225.97,
      "orderStatus": "pending",
      "paymentInfo": {
        "method": "stripe",
        "status": "pending"
      }
    }
  }
}
```

### 2. Get User Orders

```bash
# Get all orders
curl http://localhost:3001/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by status
curl "http://localhost:3001/api/orders?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"

# With pagination
curl "http://localhost:3001/api/orders?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Order Details

```bash
curl http://localhost:3001/api/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get All Orders (Admin Only)

```bash
# Get all orders
curl http://localhost:3001/api/orders/admin/all \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by date range
curl "http://localhost:3001/api/orders/admin/all?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by status
curl "http://localhost:3001/api/orders/admin/all?status=processing" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 5. Update Order Status (Admin Only)

```bash
curl -X PUT http://localhost:3001/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "processing"
  }'
```

**Available statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

### 6. Get Order Statistics (Admin Only)

```bash
curl http://localhost:3001/api/orders/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {
    "stats": {
      "totalOrders": 150,
      "pendingOrders": 20,
      "processingOrders": 30,
      "shippedOrders": 40,
      "deliveredOrders": 50,
      "totalRevenue": 45000.00,
      "averageOrderValue": 300.00
    }
  }
}
```

## Payment Processing

### 1. Create Payment Intent

```bash
curl -X POST http://localhost:3001/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderId": "ORDER_ID"
  }'
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

Use the `clientSecret` with Stripe.js on the frontend to complete payment.

### 2. Create Checkout Session

```bash
curl -X POST http://localhost:3001/api/payments/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderId": "ORDER_ID",
    "successUrl": "http://localhost:3000/success",
    "cancelUrl": "http://localhost:3000/cancel"
  }'
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {
    "sessionId": "cs_test_xxx",
    "url": "https://checkout.stripe.com/pay/cs_test_xxx"
  }
}
```

Redirect the user to the `url` to complete payment.

### 3. Get Payment Status

```bash
curl http://localhost:3001/api/payments/status/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Webhook Handler (For Stripe)

This endpoint is called by Stripe automatically. Configure it in your Stripe Dashboard:

**Webhook URL:** `https://your-domain.vercel.app/api/payments/webhook`

**Events to listen for:**
- `payment_intent.succeeded`
- `checkout.session.completed`

## JavaScript/Fetch Examples

### Authentication

```javascript
// Register
const register = async () => {
  const response = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    })
  });
  const data = await response.json();
  localStorage.setItem('token', data.data.token);
  return data;
};

// Login
const login = async () => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123'
    })
  });
  const data = await response.json();
  localStorage.setItem('token', data.data.token);
  return data;
};
```

### Products

```javascript
// Get products
const getProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`http://localhost:3001/api/products?${params}`);
  return await response.json();
};

// Get single product
const getProduct = async (id) => {
  const response = await fetch(`http://localhost:3001/api/products/${id}`);
  return await response.json();
};
```

### Cart

```javascript
// Add to cart
const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  return await response.json();
};

// Get cart
const getCart = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/cart', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

### Orders

```javascript
// Create order
const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return await response.json();
};

// Get user orders
const getOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/orders', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

### Payments

```javascript
// Create checkout session
const createCheckoutSession = async (orderId) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/payments/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      orderId,
      successUrl: window.location.origin + '/success',
      cancelUrl: window.location.origin + '/cancel'
    })
  });
  const data = await response.json();
  // Redirect to Stripe checkout
  window.location.href = data.data.url;
};
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Testing Tips

1. **Use Environment Variables**: Store your tokens in environment variables
2. **Test in Order**: Register → Login → Get Products → Add to Cart → Create Order → Payment
3. **Create Admin User**: Use MongoDB directly or create a seed script to set `role: 'admin'`
4. **Test Validation**: Try sending invalid data to test validation
5. **Test Pagination**: Create multiple items and test pagination
6. **Monitor Logs**: Check server logs for detailed error information

## Postman Collection

To test with Postman:

1. Create a new collection
2. Add environment variables:
   - `baseUrl`: `http://localhost:3001`
   - `token`: (will be set automatically)
3. Add pre-request script to automatically use token:
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```
4. In login/register tests, save the token:
   ```javascript
   const response = pm.response.json();
   pm.environment.set('token', response.data.token);
   ```

## Common Issues

### MongoDB Connection Error
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running
- Check network access (MongoDB Atlas)

### JWT Error
- Token expired: Login again
- Invalid token: Check token format
- Missing token: Include `Authorization` header

### Stripe Error
- Check API keys (test vs production)
- Verify webhook secret
- Test with Stripe CLI

### CORS Error
- Set `CORS_ORIGIN` in `.env`
- Include credentials in fetch: `credentials: 'include'`
