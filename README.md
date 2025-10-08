# SKC: Youth Hub

A vibrant web platform designed to connect and empower the youth community. This project aims to provide resources, events, and interactive features for young people to engage, share, and grow together.

# PERN Stack Application 
This is PERN application that uses PostgreSQL, Express, React(with Vite), and Node.js.

# Tools and State Management
Redux
Axios
Sass

## 🚀 Getting Started

Follow these instructions to set up the project locally:

### 📦 Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```
### 📁 Install Dependencies

#### For the backend
```bash
cd server 
npm install
```


#### For the client
```bash
cd client 
npm install
```
#### Configure Environment Variables
Create a .env file in the project root directory and add the following variables. Modify the values as needed.

```bash
DATABASE_URI=
NODE_ENV=development
PORT = 
JWT_SECRET =  
```


## Run the Application in development mode

Start both the backend and frontend servers.

### Backend

Navigate to the project root directory and start the backend server.

```sh
cd backend/
npm run dev
```

### Frontend

Navigate to the `client` directory and start the frontend server.

```sh
cd client/
npm run dev
```

# Environment Variables Setup

## Backend (.env file in server directory)

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sk_youth_hub
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000

# SMTP Configuration for Email Verification
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Frontend (.env file in client directory)

Create a `.env` file in the `client` directory with the following variables:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## Setup Instructions

### 1. SMTP Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set Application type to "Web application"
6. Add authorized origins:
   - `http://localhost:3000` (for development)
   - Your production domain (for production)
7. Copy the Client ID to both backend and frontend `.env` files

### 3. Cloudinary Setup (for file uploads)

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard to get your credentials
3. Copy the values to your backend `.env` file

## Features Added

### ✅ Fixed Issues
- React warnings (completed prop, Grid props, aria-hidden)
- Purok fetch issue resolved

### ✅ New Features
- **SMTP Email Verification**: Users receive verification emails after signup
- **Google OAuth Login**: One-click login with Google account
- **Email Verification Page**: Clean UI for email verification with continue button
- **Auto-verification**: Google OAuth users are automatically verified

### ✅ Updated Components
- YouthSignup form with 4-step process
- Login page with Google OAuth integration
- Email verification flow
- Grid components updated to Grid2 (MUI v5+)

## Usage

1. Set up environment variables as described above
2. Start the backend: `cd server && npm start`
3. Start the frontend: `cd client && npm run dev`
4. Users can now:
   - Sign up with email verification
   - Login with Google OAuth
   - Verify email through the verification page


### Test 
https://skcyouthhub.netlify.app/