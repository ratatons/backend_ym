# Yo Mama Backend API

A production-ready REST API backend for the Yo Mama React Native (Expo) application. Built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with bcrypt password hashing
- 👥 **User Management** - Registration, login, profile management, and user search
- 😂 **Joke API** - Fetch random jokes from external API with automatic fallback
- 💾 **Favorites** - Save and manage favorite jokes
- 💬 **Messaging** - Send jokes to other users with real-time notifications
- 🔔 **Push Notifications** - Expo push notifications when users receive jokes
- 🛡️ **Security** - Helmet, CORS, rate limiting, and input validation
- 📊 **Scalable** - MongoDB Atlas integration for reliable data persistence
- 🐳 **Docker Ready** - Dockerfile included for containerized deployment
- ☁️ **Render.com** - Deploy-ready with render.yaml configuration

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit
- **HTTP Client**: Axios
- **Deployment**: Docker, Render.com

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts              # MongoDB connection configuration
│   ├── models/
│   │   ├── User.ts                 # User schema and interface
│   │   ├── Message.ts              # Message schema and interface
│   │   └── Favorite.ts             # Favorite schema and interface
│   ├── controllers/
│   │   ├── AuthController.ts       # Authentication endpoints
│   │   ├── UserController.ts       # User endpoints
│   │   ├── JokeController.ts       # Joke endpoints
│   │   ├── FavoriteController.ts   # Favorite endpoints
│   │   └── MessageController.ts    # Messaging endpoints
│   ├── services/
│   │   ├── AuthService.ts          # Authentication business logic
│   │   ├── JokeService.ts          # Joke fetching logic
│   │   └── PushNotificationService.ts  # Push notification logic
│   ├── routes/
│   │   ├── authRoutes.ts           # Auth routes
│   │   ├── userRoutes.ts           # User routes
│   │   ├── jokeRoutes.ts           # Joke routes
│   │   ├── favoriteRoutes.ts       # Favorite routes
│   │   ├── messageRoutes.ts        # Message routes
│   │   └── pushRoutes.ts           # Push token routes
│   ├── middleware/
│   │   ├── auth.ts                 # JWT authentication middleware
│   │   ├── errorHandler.ts         # Error handling middleware
│   │   └── logger.ts               # Request logging middleware
│   ├── validations/
│   │   ├── auth.ts                 # Auth schema validation
│   │   ├── message.ts              # Message schema validation
│   │   └── favorite.ts             # Favorite schema validation
│   ├── utils/
│   │   ├── jwt.ts                  # JWT utilities
│   │   ├── errors.ts               # Custom error classes
│   │   └── jokes.ts                # Fallback jokes list
│   ├── app.ts                      # Express app configuration
│   └── server.ts                   # Server entry point
├── Dockerfile                       # Docker configuration
├── render.yaml                      # Render.com deployment config
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── .env.example                     # Example environment variables
└── README.md                        # This file
```

## Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **MongoDB Atlas** account (free tier available at https://www.mongodb.com/cloud/atlas)
- **Git**

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend_ym
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new cluster
4. Create a database user with username and password
5. Get your connection string
6. Update the connection string format:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/yo-mama?retryWrites=true&w=majority
   ```

### 4. Create Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server Configuration
PORT=10000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/yo-mama?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_key_generate_random_string

# CORS
CORS_ORIGIN=*

# External APIs
YOMAMA_JOKES_API=https://yomama-jokes.com/api/random

# Expo Push Notifications
EXPO_ACCESS_TOKEN=your_expo_access_token_here
```

### 5. Build TypeScript

```bash
npm run build
```

### 6. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:10000`

Test the health endpoint:
```bash
curl http://localhost:10000/health
```

## API Endpoints

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john",
      "email": "john@example.com",
      "createdAt": "2024-01-10T12:00:00Z",
      "updatedAt": "2024-01-10T12:00:00Z"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users (Paginated)
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <token>
```

#### Search Users
```http
GET /api/users/search?q=john
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /api/users/{userId}
Authorization: Bearer <token>
```

### Joke Endpoints

#### Get Random Joke
```http
GET /api/jokes/random
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "joke": "Yo mama so fat, she has her own zip code."
  }
}
```

### Favorite Endpoints

#### Add Favorite
```http
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "jokeText": "Yo mama so fat, she has her own zip code."
}
```

#### Get Favorites (Paginated)
```http
GET /api/favorites?page=1&limit=10
Authorization: Bearer <token>
```

#### Delete Favorite
```http
DELETE /api/favorites/{favoriteId}
Authorization: Bearer <token>
```

### Messaging Endpoints

#### Send Message (with Joke)
```http
POST /api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "507f1f77bcf86cd799439011",
  "jokeText": "Yo mama so fat, she has her own zip code."
}
```

#### Get Inbox (Received Messages)
```http
GET /api/messages/inbox?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Sent Messages
```http
GET /api/messages/sent?page=1&limit=10
Authorization: Bearer <token>
```

#### Mark Message as Read
```http
PATCH /api/messages/{messageId}/read
Authorization: Bearer <token>
```

### Push Notification Endpoints

#### Set Expo Push Token
```http
POST /api/users/push-token
Authorization: Bearer <token>
Content-Type: application/json

{
  "expoPushToken": "ExponentPushToken[abc123...]"
}
```

### Health Check

```http
GET /health
```

**Response**:
```json
{
  "success": true,
  "message": "Backend healthy"
}
```

## Database Models

### User Model

```typescript
{
  _id: ObjectId,
  username: string (unique, 3-30 chars),
  email: string (unique, valid email),
  passwordHash: string (bcrypted),
  expoPushToken?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model

```typescript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  jokeText: string (max 1000 chars),
  read: boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Favorite Model

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  jokeText: string (max 1000 chars),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: bcrypt with salt rounds of 10
- **JWT Tokens**: 7-day expiration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable origin
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation
- **SQL/NoSQL Injection**: Prevented by Mongoose
- **XSS Protection**: Helmet headers

## Production Deployment

### Option 1: Deploy on Render.com

#### Prerequisites
- GitHub account with repository
- Render.com account
- MongoDB Atlas connection string

#### Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Render**
   - Go to [Render.com](https://render.com)
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

3. **Configure Service**
   - **Name**: yo-mama-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Paid if needed)

4. **Set Environment Variables**
   - Click "Environment"
   - Add all variables from `.env.example`:
     - `PORT`: 10000
     - `NODE_ENV`: production
     - `MONGODB_URI`: Your connection string
     - `JWT_SECRET`: Generate a strong random string
     - `CORS_ORIGIN`: Your React Native app URL or *
     - `YOMAMA_JOKES_API`: https://yomama-jokes.com/api/random
     - `EXPO_ACCESS_TOKEN`: Your Expo token

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API URL will be: `https://yo-mama-backend.onrender.com`

### Option 2: Docker Deployment

Build Docker image:
```bash
docker build -t yo-mama-backend:latest .
```

Run container:
```bash
docker run -p 10000:10000 \
  -e MONGODB_URI="your_connection_string" \
  -e JWT_SECRET="your_secret" \
  yo-mama-backend:latest
```

### Option 3: Using render.yaml

Deploy directly from GitHub:
```bash
# The render.yaml file defines everything needed
# Just connect your GitHub repo to Render
```

## Environment Variables Reference

```env
# Server
PORT                    # Port number (default: 10000)
NODE_ENV               # Environment: development or production

# Database
MONGODB_URI            # MongoDB Atlas connection string (required)

# Authentication
JWT_SECRET             # Secret key for JWT signing (generate random string, min 32 chars)

# CORS
CORS_ORIGIN            # Allowed origins (* for all)

# External APIs
YOMAMA_JOKES_API       # Yo Mama jokes API endpoint

# Expo Notifications
EXPO_ACCESS_TOKEN      # Expo push notification access token
```

## Generating a Secure JWT Secret

On Linux/Mac:
```bash
openssl rand -base64 32
```

On Windows (PowerShell):
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).Guid + (New-Guid).Guid))
```

## Testing the API

### Using cURL

**Register a user**:
```bash
curl -X POST http://localhost:10000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:10000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get random joke** (replace TOKEN with actual token):
```bash
curl -X GET http://localhost:10000/api/jokes/random \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API into Postman
2. Set `{{baseUrl}}` variable to `http://localhost:10000`
3. Set `{{token}}` variable after login response
4. Use the token in Authorization header for protected routes

### Using VS Code REST Client

Create `requests.http`:
```http
### Variables
@baseUrl = http://localhost:10000
@token = 

### Register
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

### Login
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Get Random Joke
GET {{baseUrl}}/api/jokes/random
Authorization: Bearer {{token}}
```

## Available Scripts

```bash
# Development
npm run dev           # Start dev server with ts-node

# Production
npm run build         # Compile TypeScript to JavaScript
npm start             # Start production server

# Type checking
npm run type-check    # Check TypeScript types

# Linting
npm run lint          # Run ESLint
```

## Troubleshooting

### MongoDB Connection Failed

**Problem**: `MongooseError: Cannot connect to MongoDB`

**Solution**:
1. Check MongoDB Atlas is running
2. Verify connection string is correct
3. Check IP whitelist: All IPs (0.0.0.0/0) or add your IP
4. Check database user has correct permissions

### CORS Errors

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Set `CORS_ORIGIN` to match your frontend URL
2. For development: use `*` (not recommended for production)
3. Use multiple origins: `CORS_ORIGIN=http://localhost:3000,https://app.example.com`

### JWT Token Expired

**Problem**: `Invalid or expired token`

**Solution**:
1. Get a new token by logging in again
2. Tokens expire after 7 days
3. Store token in secure storage on client

### Push Notifications Not Working

**Problem**: Notifications not received in Expo app

**Solution**:
1. Verify expo push token is correctly formatted (starts with `ExponentPushToken[`)
2. Check `EXPO_ACCESS_TOKEN` is valid
3. Ensure receiver has enabled notifications in app
4. Check network connectivity

## Performance Considerations

- **Indexes**: Database queries are indexed on frequently searched fields
- **Pagination**: All list endpoints support pagination to reduce data transfer
- **Rate Limiting**: Enabled to prevent abuse
- **Caching**: Consider implementing Redis for session caching in production
- **Connection Pooling**: Mongoose handles connection pooling automatically

## Monitoring and Logging

### Server Logs

The application logs:
- Request/response times
- Database connection status
- Errors and exceptions
- Authentication events

### Health Check

Regular health checks via `/health` endpoint ensure the service is running:
```bash
curl https://yo-mama-backend.onrender.com/health
```

## Next Steps

1. Set up error tracking (e.g., Sentry)
2. Implement request monitoring (e.g., Datadog)
3. Add API documentation (e.g., Swagger/OpenAPI)
4. Set up CI/CD pipeline
5. Implement caching layer (Redis)
6. Add database backups and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready
