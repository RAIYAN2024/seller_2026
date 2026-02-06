# Quick Start Guide - Ecommerce Backend

Get your ecommerce backend up and running in minutes!

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js (server framework)
- MongoDB/Mongoose (database)
- JWT & bcrypt (authentication)
- Stripe (payments)
- And more...

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

**Minimum Required:**
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-this
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CORS_ORIGIN=http://localhost:3000
```

**For MongoDB Atlas (Recommended for Production):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

### 3. Start MongoDB (if running locally)

```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# MongoDB should start automatically after installation
```

### 4. Seed the Database (Optional but Recommended)

```bash
npm run seed
```

This creates:
- **Admin account**: admin@example.com / admin123
- **User account**: user@example.com / user123
- **10 sample products** across different categories

### 5. Start the Server

```bash
npm run server
```

Or for development with auto-reload:

```bash
npm run server:dev
```

The server will start at: **http://localhost:3001**

### 6. Test the API

Open your browser or use curl:

```bash
curl http://localhost:3001/api
```

You should see:
```json
{
  "success": true,
  "message": "Ecommerce API is running",
  "version": "1.0.0"
}
```

## 🎯 Test the Complete Flow

### 1. Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Save the returned token!

### 2. Get Products

```bash
curl http://localhost:3001/api/products
```

### 3. Add to Cart

```bash
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID_FROM_STEP_2",
    "quantity": 1
  }'
```

### 4. Create Order

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"product": "PRODUCT_ID", "quantity": 1}],
    "shippingAddress": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "1234567890",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    }
  }'
```

## 📦 Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

### 4. Set Environment Variables in Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables

Add:
- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN`
- `NODE_ENV=production`

### 5. Redeploy

```bash
vercel --prod
```

Your API is now live! 🎉

## 🔑 Using the Seeded Accounts

After running `npm run seed`, you can immediately login with:

**Admin Account** (full access):
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**User Account** (regular user):
```json
{
  "email": "user@example.com",
  "password": "user123"
}
```

## 📚 Available API Endpoints

| Category | Endpoint | Method | Auth |
|----------|----------|--------|------|
| **Auth** | `/api/auth/register` | POST | No |
| | `/api/auth/login` | POST | No |
| | `/api/auth/profile` | GET | Yes |
| **Products** | `/api/products` | GET | No |
| | `/api/products/:id` | GET | No |
| | `/api/products` | POST | Admin |
| **Cart** | `/api/cart` | GET | Yes |
| | `/api/cart` | POST | Yes |
| **Orders** | `/api/orders` | GET | Yes |
| | `/api/orders` | POST | Yes |
| | `/api/orders/admin/all` | GET | Admin |
| **Payments** | `/api/payments/create-checkout-session` | POST | Yes |

Full documentation: See `API_TESTING_GUIDE.md`

## 🛠️ Development Tools

### Watch Mode (Auto-reload)
```bash
npm run server:dev
```

### Test API Endpoints
Use the included test examples in `API_TESTING_GUIDE.md`

### MongoDB GUI
- **MongoDB Compass**: https://www.mongodb.com/products/compass
- **Studio 3T**: https://robomongo.org/

### API Testing
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **Thunder Client** (VS Code Extension)

## 🐛 Troubleshooting

### "MongoDB connection error"
- **Local**: Ensure MongoDB is running (`brew services start mongodb-community`)
- **Atlas**: Check your connection string and network access settings

### "JWT error" / "Token invalid"
- Make sure `JWT_SECRET` is set in `.env`
- Token might be expired, login again

### "Port already in use"
- Change `PORT` in `.env` to a different port (e.g., 3002)
- Or stop the process using port 3001: `lsof -ti:3001 | xargs kill`

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### Stripe errors
- Use test keys from Stripe Dashboard (starts with `sk_test_`)
- In test mode, you can use card number: `4242 4242 4242 4242`

## 📖 Next Steps

1. **Read the full documentation**: `ECOMMERCE_BACKEND_README.md`
2. **Test all endpoints**: `API_TESTING_GUIDE.md`
3. **Customize models**: Edit files in `server/models/`
4. **Add new features**: Follow the existing pattern in controllers and routes
5. **Set up email notifications**: Configure SMTP settings in `.env`
6. **Add more payment methods**: Extend the payment controller

## 🎨 Frontend Integration

This backend works with any frontend framework:

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
  const data = await response.json();
  localStorage.setItem('token', data.data.token);
  return data;
};

// Get products
const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return await response.json();
};

// Add to cart (authenticated)
const addToCart = async (productId, quantity) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  return await response.json();
};
```

## 💡 Tips

1. **Use Environment Variables**: Never commit `.env` file
2. **Test with Seed Data**: Run `npm run seed` to quickly test with sample data
3. **Use MongoDB Atlas**: Free tier is perfect for development
4. **Stripe Test Mode**: Use test keys during development
5. **Check Logs**: Server logs provide detailed error information
6. **Use Postman**: Great for testing and documenting APIs
7. **Rate Limiting**: API is rate-limited by default (100 requests per 15 minutes)

## 🎉 You're Ready!

Your ecommerce backend is now running! Start building your frontend or integrate with an existing one.

Need help? Check out:
- `ECOMMERCE_BACKEND_README.md` - Complete documentation
- `API_TESTING_GUIDE.md` - Detailed API testing examples
- GitHub Issues - Report bugs or request features

Happy coding! 🚀
