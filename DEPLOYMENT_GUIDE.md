# Deployment Guide - Ecommerce Backend

Complete guide for deploying your ecommerce backend to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] MongoDB Atlas account (or other production database)
- [ ] Stripe account with production keys
- [ ] Environment variables configured
- [ ] API tested locally
- [ ] Vercel account (or other hosting platform)

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy this serverless Express.js application.

### Step 1: Create MongoDB Atlas Database

1. **Sign up for MongoDB Atlas** (free tier available)
   - Visit: https://www.mongodb.com/cloud/atlas/register

2. **Create a new cluster**
   - Choose the free tier (M0)
   - Select a region close to your users

3. **Create database user**
   - Database Access → Add New Database User
   - Choose password authentication
   - Save username and password

4. **Whitelist IP addresses**
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific IP addresses

5. **Get connection string**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority`

### Step 2: Setup Stripe

1. **Create Stripe account**
   - Visit: https://dashboard.stripe.com/register

2. **Get API keys**
   - Developers → API keys
   - Copy "Publishable key" and "Secret key"
   - **For production**: Toggle to "Live mode" to get production keys

3. **Generate JWT secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### Step 3: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 4: Login to Vercel

```bash
vercel login
```

### Step 5: Deploy

```bash
cd /path/to/your/project
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Choose your account
- **Link to existing project?** No (first time)
- **What's your project's name?** ecommerce-backend (or your choice)
- **In which directory is your code located?** ./

### Step 6: Configure Environment Variables

#### Option A: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `MONGODB_URI` | Your MongoDB Atlas connection string | All |
| `JWT_SECRET` | Generated secret from Step 2 | All |
| `JWT_EXPIRE` | `7d` | All |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | All |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | All |
| `STRIPE_WEBHOOK_SECRET` | (Will add after webhook setup) | All |
| `CORS_ORIGIN` | Your frontend URL | All |
| `RATE_LIMIT_WINDOW_MS` | `900000` | All |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | All |

#### Option B: Via Vercel CLI

```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string

vercel env add JWT_SECRET
# Paste your generated JWT secret

vercel env add STRIPE_SECRET_KEY
# Paste your Stripe secret key

# Repeat for all variables...
```

### Step 7: Redeploy with Environment Variables

```bash
vercel --prod
```

Your API is now live! 🎉

You'll get a URL like: `https://your-project.vercel.app`

### Step 8: Setup Stripe Webhook

1. **Go to Stripe Dashboard**
   - Developers → Webhooks
   - Click "Add endpoint"

2. **Configure webhook**
   - Endpoint URL: `https://your-project.vercel.app/api/payments/webhook`
   - Description: Ecommerce Backend
   - Events to listen to:
     - `payment_intent.succeeded`
     - `checkout.session.completed`

3. **Get signing secret**
   - After creating, click on the webhook
   - Copy the "Signing secret" (starts with `whsec_`)

4. **Add to Vercel environment variables**
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET
   # Paste the signing secret
   ```

5. **Redeploy**
   ```bash
   vercel --prod
   ```

### Step 9: Test Production API

```bash
curl https://your-project.vercel.app/api
```

Expected response:
```json
{
  "success": true,
  "message": "Ecommerce API is running",
  "version": "1.0.0"
}
```

### Step 10: Seed Production Database (Optional)

**Method 1: Update .env locally and run seed**
```bash
# Temporarily update .env with production MongoDB URI
MONGODB_URI=your_production_mongodb_uri npm run seed
```

**Method 2: Create products via API**
Use your admin account to create products via POST `/api/products`

## 🌐 Deploy to Other Platforms

### Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create Procfile**
   ```
   web: node server.js
   ```

4. **Create app**
   ```bash
   heroku create your-app-name
   ```

5. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set STRIPE_SECRET_KEY=your_stripe_key
   # ... set all variables
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize project**
   ```bash
   railway init
   ```

4. **Add environment variables**
   ```bash
   railway variables set MONGODB_URI=your_mongodb_uri
   # ... set all variables
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### Deploy to AWS (EC2)

1. **Launch EC2 instance**
   - Choose Ubuntu Server
   - t2.micro eligible for free tier

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone and setup**
   ```bash
   git clone your-repo-url
   cd your-project
   npm install
   ```

6. **Create .env file**
   ```bash
   nano .env
   # Paste your production environment variables
   ```

7. **Start with PM2**
   ```bash
   pm2 start server.js --name ecommerce-api
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx reverse proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:
   ```nginx
   location /api {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

## 🔒 Production Security Checklist

### Environment Variables
- [ ] All secrets stored in environment variables
- [ ] `.env` file NOT committed to git
- [ ] Strong JWT secret (64+ characters)
- [ ] Production Stripe keys used
- [ ] CORS origin set to frontend domain

### Database
- [ ] MongoDB Atlas with network restrictions
- [ ] Strong database password
- [ ] Backup strategy in place
- [ ] Indexes created for performance

### API Security
- [ ] Rate limiting enabled
- [ ] Helmet middleware active
- [ ] Input validation on all endpoints
- [ ] Authentication required where needed
- [ ] Admin endpoints properly protected

### Monitoring
- [ ] Error logging configured
- [ ] Performance monitoring setup
- [ ] Stripe webhook monitoring
- [ ] Database connection monitoring

## 📊 Monitoring & Logging

### Vercel Logs

View logs in real-time:
```bash
vercel logs --follow
```

Or via dashboard:
- Go to your project
- Click "Logs" tab

### Setup Error Tracking (Optional)

#### Sentry Integration

1. **Install Sentry**
   ```bash
   npm install @sentry/node
   ```

2. **Initialize in app.js**
   ```javascript
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   
   // Add before error handler
   app.use(Sentry.Handlers.errorHandler());
   ```

3. **Add SENTRY_DSN to environment variables**

### Database Monitoring

Monitor MongoDB Atlas:
- Atlas Dashboard → Metrics
- Set up alerts for:
  - High connection count
  - Low storage space
  - Performance degradation

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

Add secrets to GitHub:
- Settings → Secrets → Actions
- Add: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## 🧪 Testing Production

### Health Check

```bash
curl https://your-api-url.vercel.app/api
```

### Test Authentication

```bash
curl -X POST https://your-api-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Products

```bash
curl https://your-api-url.vercel.app/api/products
```

### Test with Postman

1. Import `Ecommerce_API.postman_collection.json`
2. Update `baseUrl` variable to your production URL
3. Test all endpoints

## 🔧 Troubleshooting

### "MongoDB connection error"
- Verify connection string format
- Check database user credentials
- Ensure IP whitelist includes 0.0.0.0/0 for serverless
- Check MongoDB Atlas cluster status

### "Function timeout"
- Increase timeout in vercel.json:
  ```json
  {
    "functions": {
      "api/index.js": {
        "maxDuration": 10
      }
    }
  }
  ```

### "CORS error"
- Verify `CORS_ORIGIN` includes your frontend URL
- Check protocol (http vs https)
- Ensure no trailing slash

### "Rate limit error"
- Adjust `RATE_LIMIT_MAX_REQUESTS`
- Or disable for testing (not recommended)

### Stripe webhook not working
- Verify webhook URL is correct
- Check webhook signing secret
- Test with Stripe CLI:
  ```bash
  stripe listen --forward-to https://your-api-url.vercel.app/api/payments/webhook
  ```

## 📈 Performance Optimization

### Database Indexes
Already configured in models:
- Product: name, category, price
- User: email
- Order: user, orderStatus

### Caching (Optional)

Add Redis caching:
```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache products
app.get('/api/products', async (req, res) => {
  const cached = await client.get('products');
  if (cached) return res.json(JSON.parse(cached));
  
  // ... fetch from DB
  await client.setEx('products', 3600, JSON.stringify(products));
});
```

### CDN for Images

Use services like:
- Cloudinary
- AWS S3 + CloudFront
- Vercel Blob Storage

## 🎉 Post-Deployment

### Update Frontend
Update your frontend API URL:
```javascript
const API_URL = 'https://your-api-url.vercel.app/api';
```

### Create Admin Account
Seed your database or register an admin:
```bash
# Update one user to admin via MongoDB Compass or shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Documentation
- Share API documentation with your team
- Update README with production URL
- Document any custom configurations

### Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error alerts
- Monitor Stripe dashboard for payments

## 🚨 Rollback Strategy

If issues occur after deployment:

```bash
# Vercel - rollback to previous deployment
vercel rollback

# Or deploy specific commit
git checkout previous-commit-hash
vercel --prod
```

## 📞 Support

If you encounter issues:
1. Check logs: `vercel logs`
2. Verify environment variables
3. Test locally with production config
4. Check service status:
   - MongoDB Atlas Status
   - Stripe Status
   - Vercel Status

---

**Congratulations!** 🎉 Your ecommerce backend is now live in production!
