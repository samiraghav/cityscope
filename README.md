# Cityscope

**Cityscope** is a location-based community platform built with a modern MERN stack (MongoDB, Express, React, Node.js). It allows users to post local updates, engage with neighbors, and discover what's happening in their area.

This app mimics a Twitter-like UI with support for posting updates, images, replies, likes, and profile browsing, all filtered by location and type.

---

## Features

### User Authentication
- Sign up with profile picture, username, and bio
- Secure login using JWT
- Token-based protected routes

### Feed
- View real-time posts in a scrollable feed
- Filter posts by location and post type (recommend, help, update, event)
- Responsive layout with Twitter-style UI

### Post Creation
- Add a post with text (max 280 characters)
- Optional image upload support
- Select post type and location
- Live preview of uploaded image

### Reactions and Replies
- Like or dislike any post (one reaction per user)
- Reply to posts with text
- View all replies in a thread-like manner

### User Profiles
- View and update your own profile with username, bio, and picture
- Public profile pages show user's bio and their posts

### Routing and Navigation
- React Router with dynamic routes (`/profile/:userId`, `/feed`, `/signin`, `/signup`)
- Fully mobile-responsive layout
- Client-side navigation

---

## Technologies Used

### Frontend
- React (Vite)
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast
- FontAwesome Icons

### Backend
- Node.js
- Express.js
- MongoDB with Prisma
- JWT for auth
- Multer for file uploads
- Cloudinary for image storage

---

## Deployment

### Frontend
- Hosted on **Vercel**

To support client-side routing:
> Make sure to include the following `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend
- Hosted on **Render**
- Exposed via `/api` routes
- Handles auth, post management, file uploads, and reactions

---

## Environment Variables

### Frontend
Set up a `.env` file with:

```
VITE_API_BASE_URL=https://local-cityscope.onrender.com
```

### Backend

In your `.env`:

```
PORT=4000
DATABASE_URL=your-mongodb-uri
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Setup & Run Locally

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## Author
Samir Aghav
