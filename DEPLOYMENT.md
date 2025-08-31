# 🚀 Digital Hospital Management System - Deployment Guide

## 📋 Overview
This guide will help you deploy the Digital Hospital Management System to free hosting platforms so your friend can access and provide feedback.

## 🎯 Deployment Architecture
- **Frontend (React)**: Vercel (Free Tier)
- **Backend (Node.js)**: Railway (Free Tier)  
- **Database**: MongoDB Atlas (Free Tier)

## 📦 Prerequisites
1. **GitHub Account** (for code hosting)
2. **Vercel Account** (for frontend hosting)
3. **Railway Account** (for backend hosting)
4. **MongoDB Atlas Account** (for database)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier
3. Select cloud provider (AWS/Google Cloud/Azure)
4. Choose region closest to you
5. Click "Create"

### 1.3 Set Up Database Access
1. Go to "Database Access" → "Add New Database User"
2. Username: `digital-hospital-admin`
3. Password: Generate a strong password
4. Role: "Atlas admin"
5. Click "Add User"

### 1.4 Set Up Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Save this for Step 2

---

## ⚙️ Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

### 2.2 Deploy Backend
1. Choose "Deploy from GitHub repo"
2. Select your repository
3. Set root directory to `backend`
4. Click "Deploy"

### 2.3 Configure Environment Variables
In Railway dashboard, add these environment variables:

```env
MONGO_URI=mongodb+srv://digital-hospital-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/digital-hospital?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=5001
```

### 2.4 Get Backend URL
1. Wait for deployment to complete
2. Copy the generated URL (e.g., `https://your-app.railway.app`)
3. Save this for Step 3

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"

### 3.2 Deploy Frontend
1. Import your GitHub repository
2. Set root directory to project root (not backend)
3. Framework preset: "Vite"
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click "Deploy"

### 3.3 Configure Environment Variables
In Vercel dashboard, add this environment variable:

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

### 3.4 Update CORS in Backend
Update the CORS configuration in `backend/server.js` with your Vercel domain:

```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-app.vercel.app']
  : ['http://localhost:5173', 'http://localhost:3000'],
```

---

## 🎉 Step 4: Test Deployment

### 4.1 Test Backend
Visit: `https://your-backend-url.railway.app/api/health`
Should return: `{"status":"OK","message":"Digital Hospital API is running"}`

### 4.2 Test Frontend
Visit: `https://your-app.vercel.app`
Should show the login page

### 4.3 Test Login
Use these credentials:
- **Phone**: `+1234567890`
- **Password**: `admin123`

---

## 📊 Step 5: Share with Your Friend

### 5.1 Share Links
- **Frontend URL**: `https://your-app.vercel.app`
- **Test Credentials**: Phone: `+1234567890`, Password: `admin123`

### 5.2 Sample Data Available
The system includes:
- **8 Sample Patients** with complete medical records
- **15 Appointments** with different statuses
- **20 Medical Visits** with real diagnoses
- **Full Administrator Access**

### 5.3 Features to Test
1. **Dashboard Overview** - Real statistics and activity feed
2. **Patient Management** - Search, view, and register patients
3. **Appointment Management** - Create and manage appointments
4. **Medical Records** - Complete patient history
5. **Analytics** - Charts and trends
6. **UI Customization** - Theme and layout options

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. CORS Errors
- Check that your Vercel domain is in the CORS configuration
- Ensure environment variables are set correctly

#### 2. Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes Railway IPs
- Check connection string format
- Ensure database user has correct permissions

#### 3. Build Failures
- Check that all dependencies are in `package.json`
- Verify build commands are correct
- Check for TypeScript errors

#### 4. Environment Variables
- Ensure all required variables are set
- Check variable names match exactly
- Restart deployments after changing variables

---

## 📞 Support

If you encounter issues:
1. Check Railway and Vercel logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection

---

## 🎯 Next Steps

After deployment:
1. **Test all features** thoroughly
2. **Share feedback** with your friend
3. **Monitor performance** using Railway/Vercel analytics
4. **Scale up** if needed (paid tiers available)

**Happy Deploying! 🚀**
