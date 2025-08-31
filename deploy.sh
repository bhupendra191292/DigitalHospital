#!/bin/bash

echo "🚀 Digital Hospital Management System - Quick Deploy"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Create .env files if they don't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=Digital Hospital
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
EOF
    echo "✅ .env file created"
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOF
# Backend Environment Variables
MONGO_URI=mongodb://localhost:27017/digital-hospital
PORT=5001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
EOF
    echo "✅ Backend .env file created"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🗄️  Set up MongoDB Atlas:"
echo "   - Go to https://www.mongodb.com/atlas"
echo "   - Create free account and cluster"
echo "   - Get your connection string"
echo ""
echo "2. ⚙️  Deploy Backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'backend'"
echo "   - Add environment variables"
echo ""
echo "3. 🌐 Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repo"
echo "   - Set environment variables"
echo ""
echo "4. 🔗 Update CORS and API URLs:"
echo "   - Update backend/server.js with your Vercel domain"
echo "   - Set VITE_API_BASE_URL in Vercel"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎯 Quick Test Commands:"
echo "======================"
echo ""
echo "# Test backend locally:"
echo "cd backend && npm install && npm start"
echo ""
echo "# Test frontend locally:"
echo "npm install && npm run dev"
echo ""
echo "# Build for production:"
echo "npm run build"
echo ""
echo "�� Happy Deploying!"
