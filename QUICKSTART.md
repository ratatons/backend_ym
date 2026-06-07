# 🚀 Quick Start Guide

Get your Yo Mama backend running in 5 minutes.

## Prerequisites

- Node.js 20.x+ installed
- MongoDB Atlas account (free at mongodb.com)
- GitHub account (for Render deployment)

## Local Development (3 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/yo-mama?retryWrites=true&w=majority
JWT_SECRET=your_random_32_char_string
```

### 3. Start Server
```bash
npm run dev
```

Visit: http://localhost:10000/health

## Production Deployment (2 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Yo Mama backend"
git push origin main
```

### 2. Deploy to Render
1. Go to https://render.com
2. Click "New Web Service"
3. Connect your GitHub repository
4. Click "Create"
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NODE_ENV`: production
6. Wait 2-3 minutes

Your API is now live at: `https://yo-mama-backend.onrender.com`

## Test Your API

### Health Check
```bash
curl https://yo-mama-backend.onrender.com/health
```

### Register User
```bash
curl -X POST https://yo-mama-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST https://yo-mama-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Random Joke (use token from login)
```bash
curl -X GET https://yo-mama-backend.onrender.com/api/jokes/random \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Important Paths

- **API Documentation**: [API_REFERENCE.md](API_REFERENCE.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Project README**: [README.md](README.md)
- **Full Overview**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 17 API Endpoints Available

✅ Authentication (3)
✅ Users (3)
✅ Jokes (1)
✅ Favorites (3)
✅ Messages (4)
✅ Push Notifications (1)
✅ Health (1)

See [API_REFERENCE.md](API_REFERENCE.md) for complete documentation.

## MongoDB Atlas Setup

1. https://www.mongodb.com/cloud/atlas
2. Create cluster (M0 free tier)
3. Create database user
4. Copy connection string
5. Replace `<username>:<password>` with your credentials

Example:
```
mongodb+srv://yo_mama_user:YourPassword123@your-cluster.mongodb.net/yo-mama?retryWrites=true&w=majority
```

## Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it in `.env` as `JWT_SECRET`.

## Environment Variables

```env
# Required
MONGODB_URI=...
JWT_SECRET=...

# Optional (defaults provided)
PORT=10000
NODE_ENV=production
CORS_ORIGIN=*
YOMAMA_JOKES_API=https://yomama-jokes.com/api/random
EXPO_ACCESS_TOKEN=...
```

## Scripts

```bash
npm run dev        # Development server
npm run build      # Build TypeScript
npm start          # Production server
npm run type-check # Check types
```

## Troubleshooting

### MongoDB Connection Failed
- Check connection string is correct
- Verify IP is whitelisted (0.0.0.0/0)
- Check database user password

### CORS Error
- Set `CORS_ORIGIN=*` for development
- For production, use specific URL

### Port Already in Use
```bash
lsof -i :10000      # Find process
kill -9 <PID>       # Kill process
```

## Next Steps

1. ✅ Start development server: `npm run dev`
2. ✅ Test endpoints with cURL or Postman
3. ✅ Deploy to Render.com
4. ✅ Update React Native app with API URL
5. ✅ Go live!

## Support

See full documentation in:
- [README.md](README.md) - Setup & features
- [DEPLOYMENT.md](DEPLOYMENT.md) - Render deployment
- [API_REFERENCE.md](API_REFERENCE.md) - All endpoints
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Overview

---

**Ready to deploy?** Follow [DEPLOYMENT.md](DEPLOYMENT.md)
