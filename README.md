# 🏥 Digital Hospital Management System

A **comprehensive multi-tenant SaaS platform** for healthcare management, designed to serve multiple hospitals and clinics with individual branded instances.

## 🌟 **Features**

### **Multi-Tenant Architecture**
- ✅ **Individual Hospital/Clinic Accounts** - Each facility gets its own branded instance
- ✅ **Custom Branding** - Logo, colors, and custom CSS per tenant
- ✅ **Feature Toggles** - Enable/disable features based on subscription
- ✅ **Subscription Plans** - Free, Basic, Professional, Enterprise tiers
- ✅ **Usage Limits** - User and patient limits per plan

### **Core Healthcare Features**
- 🏥 **Patient Management** - Complete patient records and history
- 📅 **Appointment Scheduling** - Advanced booking system with conflict detection
- 📋 **Medical Records** - Digital health records management
- 👨‍⚕️ **Doctor Management** - Staff and specialist management
- 📊 **Analytics Dashboard** - Comprehensive reporting and insights
- 🔍 **Audit Logging** - Complete system activity tracking
- 📱 **Responsive Design** - Works on all devices

### **Subscription Tiers**
- 🆓 **Free Plan** - 5 users, 100 patients, basic features
- 💳 **Basic Plan** - 10 users, 500 patients, advanced analytics ($99/month)
- 💼 **Professional Plan** - 25 users, 2000 patients, custom branding ($299/month)
- 🏢 **Enterprise Plan** - Unlimited users/patients, custom domain ($599/month)

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Modern styling with animations

### **Backend**
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - API protection

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Unit testing

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/digital-hospital-management.git
cd digital-hospital-management
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. **Environment Setup**
```bash
# Create .env file in backend directory
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/digital-hospital
PORT=5001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# Start MongoDB service
mongod
```

5. **Run the application**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 🧪 **Testing the Multi-Tenant System**

### **1. Create Test Data**
```bash
cd backend
node seedTestTenant.js
```

### **2. Test Credentials**
```
Admin Login:
  Phone: +1234567890
  Password: admin123

Doctor Login:
  Phone: +1234567891
  Password: admin123
```

### **3. Register New Hospital/Clinic**
1. Visit: http://localhost:5173/register
2. Fill out the registration form
3. Choose subscription plan
4. Create admin account
5. Access your branded instance

## 📁 **Project Structure**

```
digital-hospital-management/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   ├── store/                   # Redux store
│   ├── hooks/                   # Custom hooks
│   └── utils/                   # Utility functions
├── backend/                     # Backend source code
│   ├── controllers/             # Route controllers
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middlewares/             # Custom middlewares
│   ├── services/                # Business logic
│   └── utils/                   # Utility functions
├── public/                      # Static assets
└── docs/                        # Documentation
```

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/doctors/login` - Doctor login
- `POST /api/tenants/register` - Register new hospital/clinic

### **Tenant Management**
- `GET /api/tenants/config` - Get tenant configuration
- `PATCH /api/tenants/config` - Update tenant configuration
- `GET /api/tenants/stats` - Get tenant statistics

### **Patient Management**
- `POST /api/patients/register` - Register new patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID

### **Appointment Management**
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### **Admin Dashboard**
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/audit-logs` - Get audit logs

## 🏗️ **Multi-Tenant Architecture**

### **Database Design**
- **Tenant Model** - Stores facility information and configuration
- **Doctor Model** - User accounts with tenant association
- **Patient Model** - Patient records with tenant isolation
- **Appointment Model** - Scheduling with tenant context
- **AuditLog Model** - System activity tracking

### **Data Isolation**
- All data queries include tenant filtering
- Compound indexes for efficient tenant-specific queries
- Unique constraints per tenant (e.g., patient phone numbers)

### **Branding System**
- Custom logos and colors per tenant
- Tenant-specific subdomains
- Custom CSS injection
- Branded email templates

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Input Validation** - express-validator
- **Rate Limiting** - API protection
- **CORS Configuration** - Cross-origin security
- **Audit Logging** - Complete activity tracking

## 📊 **Business Model**

### **Revenue Streams**
- **Subscription Plans** - Monthly recurring revenue
- **Feature Upgrades** - Premium feature access
- **Enterprise Contracts** - Custom solutions
- **White-label Licensing** - Reseller opportunities

### **Market Advantages**
- **First-mover advantage** in multi-tenant healthcare SaaS
- **Network effects** - more facilities = more value
- **Data insights** across healthcare facilities
- **Partnership opportunities** with healthcare providers

## 🚀 **Deployment**

### **Production Setup**
```bash
# Environment variables
NODE_ENV=production
MONGO_URI=mongodb://your-production-db
JWT_SECRET=your-secure-jwt-secret
DOMAIN=yourdomain.com
```

### **Docker Deployment**
```bash
# Build and run with Docker
docker-compose up -d
```

### **Cloud Deployment**
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Heroku, AWS EC2, or Google Cloud
- **Database**: MongoDB Atlas or AWS DocumentDB

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: [Wiki](https://github.com/yourusername/digital-hospital-management/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/digital-hospital-management/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/digital-hospital-management/discussions)

## 🙏 **Acknowledgments**

- Healthcare professionals for domain expertise
- Open source community for amazing tools
- Contributors and beta testers

---

## 🎯 **Roadmap**

### **Phase 1: Core Features** ✅
- [x] Multi-tenant architecture
- [x] Patient management
- [x] Appointment scheduling
- [x] Basic analytics

### **Phase 2: Advanced Features** 🚧
- [ ] Billing and payments
- [ ] Inventory management
- [ ] Lab reports integration
- [ ] Telemedicine features

### **Phase 3: Enterprise Features** 📋
- [ ] Custom domain setup
- [ ] White-label solution
- [ ] API marketplace
- [ ] Advanced reporting

---

**Built with ❤️ for the healthcare community**
