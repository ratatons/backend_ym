# Yo Mama API - Complete Endpoints Reference

## Base URL

- **Development**: `http://localhost:10000`
- **Production**: `https://yo-mama-backend.onrender.com`

## Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

## Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "pagination": { /* optional */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Health Check

### GET /health

Check if backend is running. No authentication required.

**Request:**
```http
GET /health
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Backend healthy"
}
```

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user.

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Request Schema:**
- `username` (string, required): 3-30 characters, unique
- `email` (string, required): Valid email, unique
- `password` (string, required): Minimum 6 characters

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2024-01-10T12:00:00.000Z",
      "updatedAt": "2024-01-10T12:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input (email format, password too short, etc.)
- `409 Conflict`: Username or email already exists

---

### POST /api/auth/login

Login user and get JWT token.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Request Schema:**
- `email` (string, required): Valid email
- `password` (string, required): User's password

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "expoPushToken": null,
      "createdAt": "2024-01-10T12:00:00.000Z",
      "updatedAt": "2024-01-10T12:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input format
- `401 Unauthorized`: Invalid email or password

---

### GET /api/auth/me

Get current authenticated user.

**Request:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "expoPushToken": null,
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token

---

## User Endpoints

### GET /api/users

Get all users (paginated).

**Request:**
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number, default: 1
- `limit` (integer, optional): Items per page, default: 10

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2024-01-10T12:00:00.000Z",
      "updatedAt": "2024-01-10T12:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "username": "jane_doe",
      "email": "jane@example.com",
      "createdAt": "2024-01-10T13:00:00.000Z",
      "updatedAt": "2024-01-10T13:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token

---

### GET /api/users/search

Search for users by username or email.

**Request:**
```http
GET /api/users/search?q=john
Authorization: Bearer <token>
```

**Query Parameters:**
- `q` (string, required): Search query (minimum 2 characters)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2024-01-10T12:00:00.000Z",
      "updatedAt": "2024-01-10T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Query too short
- `401 Unauthorized`: Invalid or missing token

---

### GET /api/users/:id

Get user by ID.

**Request:**
```http
GET /api/users/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (string, required): User MongoDB ObjectId

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: User doesn't exist
- `401 Unauthorized`: Invalid or missing token

---

## Joke Endpoints

### GET /api/jokes/random

Get a random joke from external API (or fallback).

**Request:**
```http
GET /api/jokes/random
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "joke": "Yo mama so fat, when she wears a yellow raincoat, people run after her yelling 'taxi'."
  }
}
```

**Notes:**
- If external API fails, returns joke from fallback list
- Fallback ensures service always returns a joke

---

## Favorite Endpoints

### POST /api/favorites

Add a joke to favorites.

**Request:**
```http
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "jokeText": "Yo mama so fat, she has her own zip code."
}
```

**Request Schema:**
- `jokeText` (string, required): Joke text (max 1000 characters)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "jokeText": "Yo mama so fat, she has her own zip code.",
    "createdAt": "2024-01-10T12:30:00.000Z",
    "updatedAt": "2024-01-10T12:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Invalid or missing token
- `409 Conflict`: Joke already in favorites

---

### GET /api/favorites

Get user's favorite jokes (paginated).

**Request:**
```http
GET /api/favorites?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number, default: 1
- `limit` (integer, optional): Items per page, default: 10

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "jokeText": "Yo mama so fat, she has her own zip code.",
      "createdAt": "2024-01-10T12:30:00.000Z",
      "updatedAt": "2024-01-10T12:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token

---

### DELETE /api/favorites/:id

Remove a joke from favorites.

**Request:**
```http
DELETE /api/favorites/507f1f77bcf86cd799439013
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (string, required): Favorite MongoDB ObjectId

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Favorite deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Favorite doesn't exist
- `401 Unauthorized`: Invalid or missing token

---

## Messaging Endpoints

### POST /api/messages/send

Send a joke message to another user (triggers push notification).

**Request:**
```http
POST /api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "507f1f77bcf86cd799439012",
  "jokeText": "Yo mama so fat, she wears a compass on her belt."
}
```

**Request Schema:**
- `receiverId` (string, required): Recipient's MongoDB ObjectId
- `jokeText` (string, required): Joke text (max 1000 characters)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439012",
    "jokeText": "Yo mama so fat, she wears a compass on her belt.",
    "read": false,
    "createdAt": "2024-01-10T12:45:00.000Z",
    "updatedAt": "2024-01-10T12:45:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input or sending to self
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Receiver doesn't exist

**Side Effects:**
- Push notification sent to receiver if they have `expoPushToken` set
- Notification title: "New Yo Mama Joke 👵"
- Notification body: "{senderUsername} sent you a joke"

---

### GET /api/messages/inbox

Get received messages (paginated).

**Request:**
```http
GET /api/messages/inbox?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number, default: 1
- `limit` (integer, optional): Items per page, default: 10

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "senderId": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "receiverId": "507f1f77bcf86cd799439012",
      "jokeText": "Yo mama so fat, she wears a compass on her belt.",
      "read": false,
      "createdAt": "2024-01-10T12:45:00.000Z",
      "updatedAt": "2024-01-10T12:45:00.000Z"
    }
  ],
  "pagination": {
    "total": 23,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token

---

### GET /api/messages/sent

Get sent messages (paginated).

**Request:**
```http
GET /api/messages/sent?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number, default: 1
- `limit` (integer, optional): Items per page, default: 10

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "senderId": "507f1f77bcf86cd799439011",
      "receiverId": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "email": "jane@example.com"
      },
      "jokeText": "Yo mama so fat, she wears a compass on her belt.",
      "read": true,
      "createdAt": "2024-01-10T12:45:00.000Z",
      "updatedAt": "2024-01-10T12:46:00.000Z"
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token

---

### PATCH /api/messages/:id/read

Mark a received message as read.

**Request:**
```http
PATCH /api/messages/507f1f77bcf86cd799439014/read
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` (string, required): Message MongoDB ObjectId

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439012",
    "jokeText": "Yo mama so fat, she wears a compass on her belt.",
    "read": true,
    "createdAt": "2024-01-10T12:45:00.000Z",
    "updatedAt": "2024-01-10T12:46:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Message doesn't exist or you're not the receiver
- `401 Unauthorized`: Invalid or missing token

---

## Push Notification Endpoints

### POST /api/users/push-token

Set or update Expo push notification token.

**Request:**
```http
POST /api/users/push-token
Authorization: Bearer <token>
Content-Type: application/json

{
  "expoPushToken": "ExponentPushToken[abc123def456ghi789jkl012mno345]"
}
```

**Request Schema:**
- `expoPushToken` (string, required): Expo push token from Expo SDK

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "expoPushToken": "ExponentPushToken[abc123def456ghi789jkl012mno345]",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:50:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid token format
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

**How to Get Expo Push Token:**

```javascript
import * as Notifications from 'expo-notifications';

async function getExpoPushToken() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission not granted');
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data; // Looks like: ExponentPushToken[...]
}
```

---

## Error Codes Reference

| Code | Status | Message |
|------|--------|---------|
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Invalid or missing authentication token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (email, username) |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

- **Limit**: 100 requests per IP
- **Window**: 15 minutes
- **Response**: 429 Too Many Requests

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:10000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@ex.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:10000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ex.com","password":"pass123"}'
```

### Get Random Joke (with token)
```bash
curl -X GET http://localhost:10000/api/jokes/random \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Send Message
```bash
curl -X POST http://localhost:10000/api/messages/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiverId":"USER_ID","jokeText":"Yo mama joke here"}'
```

---

## Testing with Postman

1. Create a new Postman Collection
2. Set collection variable: `baseUrl` = `http://localhost:10000`
3. After login, set collection variable: `token` = response token value
4. Use `{{token}}` in Authorization header for protected routes

---

**Last Updated**: January 2024
**API Version**: 1.0.0
