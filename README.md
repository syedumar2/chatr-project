# Chatr Project

## Overview

`Chatr Project` is a full-stack real-time chat application built with:
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT authentication
- Frontend: React, Vite, Tailwind UI primitives, React Router, Socket.IO client

The app supports:
- user registration/login
- JWT protected REST API
- user search and contacts
- group channels and direct message channels
- file upload support for messages
- real-time messaging and presence via Socket.IO

---

## Repository Structure

```
chatr-project/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── db-config/
│   │   └── index.js
│   ├── router/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── userRoutes.js
│   │   └── index.js
│   ├── controller/
│   │   ├── authController.js
│   │   ├── channelController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── dao/
│   │   ├── userDAO.js
│   │   ├── channelDao.js
│   │   └── messageDao.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── channelModel.js
│   │   └── messageModel.js
│   ├── middleware/
│   │   ├── verifyAccessToken.js
│   │   ├── uploads.js
│   │   └── logger.js
│   ├── sockets/
│   │   ├── index.js
│   │   └── messageSockets.js
│   └── uploads/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api/axios.js
│   │   ├── components/
│   │   ├── utils/
│   │   └── ...
└── README.md
```

---

## Current Project State

### Backend

The backend exposes a REST API plus Socket.IO real-time messaging.
- `server.js` starts an Express app and a Socket.IO server.
- MongoDB connection runs in `backend/db-config/index.js` using `process.env.DB_URL`.
- Routes are organized into `auth`, `user`, `channel`, and `message` modules.
- Content uploads are stored in `backend/uploads` and served from `/uploads`.
- Socket authentication is required for all socket connections.

### Frontend

The frontend is a Vite React application.
- `frontend/src/App.jsx` defines client routes and context providers.
- `frontend/src/api/axios.js` creates a shared Axios instance.
- Auth flow is wrapped by `AuthProvider` and `ProtectedRoutes`.
- Channel/message state is managed through React contexts.
- Pages include: Home, SignIn, SignUp, Dashboard, Profile, Channel, Contact, DmChannel.

---

## Setup

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment variables file `.env` with at least:
   ```env
   DB_URL=<your-mongodb-connection-string>
   ACCESS_TOKEN_SECRET=<your-access-token-secret>
   REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
   PORT=3500
   ```
4. Start backend in development:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

> Note: `frontend/src/api/axios.js` currently uses `http://localhost:3000` as the base URL, while the backend listens on `http://localhost:3500` by default. Confirm and align the ports before running.

---

## Backend API Endpoints

### Auth API (`/api/auth`)

| Method | Route | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user with `name`, `email`, `pwd` | No |
| POST | `/api/auth/login` | Login with `email`, `pwd`; returns access token and sets refresh cookie | No |
| POST | `/api/auth/logout` | Logout and clear refresh token cookie | No |
| POST | `/api/auth/refresh` | Issue a new access token using refresh cookie | No |
| GET | `/api/auth/protected` | Returns protected user data for current user | Yes |
| PATCH | `/api/auth/update` | Update current user profile (requires token) | Yes |
| GET | `/api/auth/users?q=...` | Search users by email query | No |

### User API (`/api/user`)

| Method | Route | Description | Body |
|---|---|---|---|
| POST | `/api/user/add-user` | Add a new user document | `fullname`, `email`, `pwd`
| POST | `/api/user/get-user` | Query users by fields | query object in body
| PUT | `/api/user/update-user` | Update a user by query | `{ query, updateData }`
| DELETE | `/api/user/delete-user` | Delete a user by query | query object in body

### Channel API (`/api/channel`)

| Method | Route | Description | Auth required |
|---|---|---|---|
| POST | `/api/channel/` | Create a new group channel | Yes |
| GET | `/api/channel/` | Get channels created by current user | Yes |
| GET | `/api/channel/user` | Get channels current user belongs to | Yes |
| DELETE | `/api/channel/:cid` | Delete a channel by ID | Yes |
| PATCH | `/api/channel/?cid=...` | Update channel fields by ID | Yes |
| PATCH | `/api/channel/user` | Remove member from a channel | Yes |
| PATCH | `/api/channel/members` | Update channel members array | Yes |
| POST | `/api/channel/dm/:id` | Create a direct-message channel with another user | Yes |

### Message API (`/api/message`)

| Method | Route | Description | Auth required |
|---|---|---|---|
| GET | `/api/message/:channelid` | Fetch messages for a channel, with optional `before` and `limit` query params | No |
| POST | `/api/message/:channelid` | Send a message with optional file upload and `replyTo` | Yes |

### Static Files

- `GET /uploads/<filename>` — serves uploaded files stored in `backend/uploads`

---

## Socket.IO Events

### Authentication

Socket connections are authenticated using a JWT Bearer token passed in the handshake auth object:

```js
socket = io("http://localhost:3500", {
  auth: {
    token: `Bearer ${accessToken}`,
  },
});
```

### Events emitted by client

| Event | Payload | Description |
|---|---|---|
| `joinChannel` | `channel` | Join a Socket.IO room for a channel |
| `leaveChannel` | `channel` | Leave a channel room |
| `sendMessage` | `{ content, channel, replyMessageId }` | Send a message to a channel |
| `editMessage` | `{ messageid, content, channel }` | Edit an existing message |
| `deleteMessage` | `{ messageid }` | Delete a message |

### Events emitted by server

| Event | Payload | Description |
|---|---|---|
| `welcome` | `{ message }` | Welcome message after connect |
| `userStatusOnline` | `{ userId, status }` | Broadcast user online state |
| `userStatusOffline` | `{ userId, status }` | Broadcast user offline state |
| `newMessage` | `message` | Broadcast a newly sent message to the channel room |
| `messageSent` | `{ success, data }` | Confirmation back to sender |
| `updatedMessage` | `message` | Broadcast edited message in room |
| `deletedMessage` | `result` | Broadcast deleted message event in room |
| `error` | `{ message }` | Emit socket-level errors |
| `channel-deleted` | `{ channelId }` | Notify users when a channel is deleted |

---

## Data Models

### User

Fields:
- `name` (String)
- `email` (String, unique)
- `pwd` (String, hashed)
- `channels` (ObjectId[])
- `status` (`online` | `offline` | `busy`)
- `contacts` (ObjectId[])
- `avatar.avatarUrl` (String)
- `refreshTokens` (String[])

### Channel

Fields:
- `name` (String, unique)
- `description` (String)
- `createdBy` (ObjectId)
- `isGroup` (Boolean)
- `members` (ObjectId[])

### Message

Fields:
- `content` (String)
- `sender` (ObjectId)
- `channel` (ObjectId)
- `files` (`[{ fileUrl, fileType }]`)
- `replyTo` (ObjectId)

---

## Frontend Key Flow

### Routes

- `/` — Home page
- `/signin` — Sign In page
- `/signup` — Sign Up page
- `/dashboard` — Authenticated dashboard
- `/profile` — User profile page
- `/channel/:channelId` — Channel chat view
- `/contact/:id` — Contact details or DM initiation
- `/channel/dm/:dmChannelId` — Direct message view

### Providers

The app is wrapped in these React context providers:
- `ThemeProvider` — theme state
- `AuthProvider` — authentication state
- `ChannelProvider` — channel state
- `MessageProvider` — message state

### API client

- `frontend/src/api/axios.js` creates a shared Axios client.
- It is the central place to adjust backend base URL and request defaults.

---

## Notes to self

- The backend expects JWT auth on REST routes and Socket.IO connections.
- Socket events are channel-room based, so clients must `joinChannel` before sending messages.
- The message POST endpoint also supports file uploads using Multer.
- Channel creation validates member emails and stores member IDs.
- Direct messages are implemented as `isGroup: false` channels.
- Search uses `/api/auth/users?q=` and returns matching users by email.
- There is a likely port mismatch between frontend Axios base URL and backend default port, so verify `frontend/src/api/axios.js` before starting.

---
