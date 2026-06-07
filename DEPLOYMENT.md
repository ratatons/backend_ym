# Render.com Deployment Guide for Yo Mama Backend

## Quick Start (5 minutes)

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Production-ready Yo Mama backend"

# Create and push to GitHub
# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/backend_ym.git
git branch -M main
git push -u origin main
```

### Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a new project
4. Create a cluster (M0 free tier)
5. Create a database user:
   - Username: `yo_mama_user`
   - Password: Generate strong password
6. Whitelist all IPs: 0.0.0.0/0
7. Click "Connect" and copy connection string
8. Replace `<username>`, `<password>`, `<cluster>`:
   ```
   mongodb+srv://yo_mama_user:YOUR_PASSWORD@your-cluster-abc.mongodb.net/yo-mama?retryWrites=true&w=majority
   ```

### Step 3: Deploy to Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Select your `backend_ym` repository
5. Configure:
   - **Name**: yo-mama-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)
6. Click "Create Web Service"

### Step 4: Add Environment Variables

In Render dashboard, go to Environment:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://yo_mama_user:YOUR_PASSWORD@your-cluster.mongodb.net/yo-mama?retryWrites=true&w=majority
JWT_SECRET=<generate_random_64_char_string>
CORS_ORIGIN=*
YOMAMA_JOKES_API=https://yomama-jokes.com/api/random
EXPO_ACCESS_TOKEN=<your_expo_token_if_available>
```

### Step 5: Deploy

1. Render will automatically deploy when you save env vars
2. Wait for build to complete (2-3 minutes)
3. Your API URL: `https://yo-mama-backend.onrender.com`

### Step 6: Test Deployment

```bash
# Test health check
curl https://yo-mama-backend.onrender.com/health

# Should return:
# {"success":true,"message":"Backend healthy"}
```

## Detailed Deployment Steps

### MongoDB Atlas Configuration

#### Create Account and Project

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start free" or sign in
3. Create a new organization or project
4. Click "Create a Deployment"

#### Create Cluster

1. Select "M0" (free tier)
2. Choose your region (closest to your users)
3. Click "Create"
4. Wait for cluster creation (5-10 minutes)

#### Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: "Password"
4. Username: `yo_mama_user`
5. Password: Generate secure password (copy to secure location)
6. Database User Privileges: "Atlas Admin"
7. Click "Add User"

#### Get Connection String

1. Go to "Clusters" in left sidebar
2. Click "Connect" button on your cluster
3. Select "Connect your application"
4. Copy connection string
5. Replace placeholders:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/yo-mama?retryWrites=true&w=majority
   ```

#### Example Connection String

```
mongodb+srv://yo_mama_user:SuperSecurePass123@yo-mama-cluster-abc123.mongodb.net/yo-mama?retryWrites=true&w=majority
```

### Render.com Configuration

#### Prerequisites

- GitHub account with the repository
- Render.com account (free)

#### Step-by-Step Deployment

1. **Connect Repository**
   - Go to https://render.com/dashboard
   - Click "New" → "Web Service"
   - Click "Connect account" (GitHub)
   - Authorize Render to access GitHub
   - Select your `backend_ym` repository

2. **Configure Service**
   - **Name**: yo-mama-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
   - Leave other settings as default

3. **Add Environment Variables**
   - Click "Environment" tab
   - Add each variable:
     - `NODE_ENV` = `production`
     - `PORT` = `10000`
     - `MONGODB_URI` = Your MongoDB connection string
     - `JWT_SECRET` = Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
     - `CORS_ORIGIN` = `*` (or specific URLs)
     - `YOMAMA_JOKES_API` = `https://yomama-jokes.com/api/random`
     - `EXPO_ACCESS_TOKEN` = (leave empty for now)

4. **Deploy**
   - Click "Create Web Service"
   - Render automatically builds and deploys
   - Monitor build progress in the dashboard
   - Once deployed, your URL appears at the top

#### Get Your API URL

After deployment completes:
- Format: `https://yo-mama-backend.onrender.com`
- Check status: Visit `https://yo-mama-backend.onrender.com/health`

### Generate JWT Secret

#### Option 1: Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Option 2: Using OpenSSL (Mac/Linux)

```bash
openssl rand -hex 32
```

#### Option 3: Using PowerShell (Windows)

```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString())))
```

Example output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

## Post-Deployment Testing

### Test Health Endpoint

```bash
curl https://yo-mama-backend.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Backend healthy"
}
```

### Test Registration

```bash
curl -X POST https://yo-mama-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

Expected response (200 Created):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser123",
      "email": "test@example.com",
      "createdAt": "2024-01-10T12:00:00Z",
      "updatedAt": "2024-01-10T12:00:00Z"
    }
  }
}
```

### Test Login

```bash
curl -X POST https://yo-mama-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### Test Protected Route

```bash
# Replace TOKEN with your actual token
curl -X GET https://yo-mama-backend.onrender.com/api/jokes/random \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## Monitoring and Logs

### View Logs on Render

1. Go to your service dashboard
2. Click "Logs" tab
3. View real-time logs

### Restart Service

1. Go to your service dashboard
2. Click "Manual Deploy" dropdown
3. Select "Clear build cache & deploy"

## Troubleshooting

### Build Fails

**Issue**: Build fails during deployment

**Solution**:
1. Check logs in Render dashboard
2. Ensure all dependencies are in `package.json`
3. Verify `npm run build` works locally: `npm run build`
4. Check for TypeScript errors: `npm run type-check`

### Cannot Connect to MongoDB

**Issue**: `MongooseError: connect ECONNREFUSED`

**Solution**:
1. Verify MongoDB URI is correct
2. Check IP whitelist in MongoDB Atlas: 0.0.0.0/0
3. Verify database user password (no special chars without encoding)
4. Test connection string locally first
5. Check MongoDB cluster is running

### API Returns 500 Error

**Issue**: Endpoints return 500 Internal Server Error

**Solution**:
1. Check Render logs
2. Ensure all environment variables are set
3. Verify MongoDB connection
4. Check JWT_SECRET is set

### Cold Start Issues

**Issue**: First request takes long time

**Solution**:
- This is normal for free tier Render
- Paid tier can have better performance
- Consider upgrading plan if needed

### Rate Limiting Issues

**Issue**: Getting 429 "Too Many Requests"

**Solution**:
- API has rate limiting: 100 requests/15 minutes per IP
- Wait 15 minutes or increase limit in code if needed

## Production Best Practices

### 1. Environment Variables

- Never commit `.env` files
- Use Render secrets management
- Rotate JWT_SECRET periodically
- Keep MongoDB credentials secure

### 2. Monitoring

- Enable email notifications in Render
- Monitor logs regularly
- Set up error tracking (e.g., Sentry)
- Track database performance

### 3. Backups

- Enable automatic backups in MongoDB Atlas
- Backup data regularly
- Test restore procedures

### 4. Updates

- Keep Node.js updated
- Update dependencies regularly: `npm update`
- Review security vulnerabilities: `npm audit`

### 5. SSL/TLS

- Render provides free SSL by default
- HTTPS is enabled automatically
- Certificates renew automatically

### 6. Database Optimization

- Monitor query performance
- Create indexes as needed
- Archive old data if needed
- Implement caching if needed

## Scaling and Performance

### For Free Tier

- Good for development and small production loads
- ~10-50 concurrent users
- Database: Free MongoDB Atlas tier
- Limitations: Cold starts, shared resources

### Upgrade to Paid Plan

When you need:
- Better performance
- No cold starts
- Dedicated resources
- Higher uptime guarantee

### Database Scaling

If MongoDB reaches limits:
1. Upgrade MongoDB Atlas tier
2. Implement caching (Redis)
3. Optimize queries and indexes
4. Consider database sharding

## Costs

### Free Tier
- **Render**: Free
- **MongoDB Atlas**: Free (512MB storage)
- **Total**: $0/month

### Production Tier (Recommended)
- **Render**: ~$7/month (Starter Plan)
- **MongoDB Atlas**: ~$10-50+/month (depending on usage)
- **Total**: $20+/month

## Next Steps After Deployment

1. **Update CORS_ORIGIN** in Render env vars:
   - Set to your React Native app URL
   - Replace `*` with specific origin for security

2. **Set Expo Token** (optional):
   - Get token from Expo.dev
   - Add to `EXPO_ACCESS_TOKEN` env var

3. **Enable Advanced Monitoring**:
   - Integrate with Sentry
   - Set up uptime monitoring
   - Configure email alerts

4. **Database Backups**:
   - Enable automated backups
   - Test backup restoration

5. **Security Hardening**:
   - Review all environment variables
   - Implement request signing
   - Add authentication to health endpoint

## Support Resources

- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com
- TypeScript Docs: https://www.typescriptlang.org/docs

## Quick Reference

```bash
# Local Development
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

# Local Build Test
npm run build
npm start

# Deploy
git push origin main
# Render auto-deploys when you push

# Monitor
# Visit Render dashboard → Logs tab

# Environment Variables
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CORS_ORIGIN=*
YOMAMA_JOKES_API=https://yomama-jokes.com/api/random
```

---

**Last Updated**: January 2024
**Version**: 1.0.0
