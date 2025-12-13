# Deployment Guide for Combine Foundation Portal

This guide covers the steps to setup, configure, and deploy the Combine Foundation Portal (MERN Stack).

## Prerequisites

- **Node.js**: v18+ installed
- **MongoDB**: A running MongoDB instance (e.g., MongoDB Atlas)
- **Cloudinary Account**: For image storage
- **Gmail Account (optional)**: For sending emails (requires App Password)

## Project Structure

- `backend/`: Node.js/Express API
- `frontend/`: React + Vite application

## 1. Backend Setup

### Installation
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

### Configuration
Create a `.env` file in the `backend/` directory by copying the example:
```bash
cp .env.example .env
```
Fill in the following variables:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Set to `production` for live deployment
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for authentication
- `FRONTEND_URL`: URL where your frontend is deployed (e.g., https://your-app.vercel.app)
- `CLOUDINARY_CLOUD_NAME`, `_API_KEY`, `_API_SECRET`: From your Cloudinary dashboard
- `GMAIL_USER`, `GMAIL_APP_PASSWORD`: For email notifications

### Running Locally
```bash
npm run dev
```

### Production
The backend is ready to be deployed to platforms like **Railway**, **Render**, or **Heroku**.
- **Build Command**: `npm install` (No build script needed for this backend structure)
- **Start Command**: `node server.js`

## 2. Frontend Setup

### Installation
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### Configuration
The frontend uses Vite. Variables must be prefixed with `VITE_`.
Create a `.env` file in the `frontend/` directory if needed, or set these in your deployment platform's dashboard.

- `VITE_API_URL`: The URL of your deployed backend API (e.g., `https://your-backend.railway.app/api`)

### Running Locally
```bash
npm run dev
```

### Production Build
To build the frontend for production manually:
```bash
npm run build
```
This generates a `dist` folder containing static files.

### Deploying Frontend
The frontend can be easily deployed to **Vercel** or **Netlify**.
- **Framework Preset**: Vite
- **Build Command**: `vite build` (or `npm run build`)
- **Output Directory**: `dist`
- **Environment Variables**: Add `VITE_API_URL` pointing to your live backend.

## 3. Deployment Checklist
- [ ] Backend environment variables are set in the cloud provider.
- [ ] Frontend `VITE_API_URL` points to the production backend.
- [ ] Backend `FRONTEND_URL` points to the production frontend (for CORS and email links).
- [ ] MongoDB Network Access allows connections from your backend server IP (or 0.0.0.0/0).
