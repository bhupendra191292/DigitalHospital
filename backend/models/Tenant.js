const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['hospital', 'clinic', 'medical-center'],
    default: 'hospital'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Business Information
  businessLicense: String,
  taxId: String,
  establishedDate: Date,
  
  // Branding
  logo: {
    url: String,
    alt: String
  },
  favicon: {
    url: String,
    alt: String
  },
  
  // UI Customization
  primaryColor: {
    type: String,
    default: '#2563eb'
  },
  secondaryColor: {
    type: String,
    default: '#059669'
  },
  customCSS: String,
  
  // Advanced UI Customization
  uiCustomization: {
    // Color Scheme
    colors: {
      primary: { type: String, default: '#2563eb' },
      secondary: { type: String, default: '#059669' },
      accent: { type: String, default: '#f59e0b' },
      success: { type: String, default: '#10b981' },
      warning: { type: String, default: '#f59e0b' },
      error: { type: String, default: '#ef4444' },
      background: { type: String, default: '#ffffff' },
      surface: { type: String, default: '#f8fafc' },
      text: { type: String, default: '#1f2937' },
      textSecondary: { type: String, default: '#6b7280' }
    },
    // Typography
    typography: {
      fontFamily: { type: String, default: 'Inter, system-ui, sans-serif' },
      lineHeight: { type: String, default: '1.5' },
      fontSize: {
        xs: { type: String, default: '0.75rem' },
        sm: { type: String, default: '0.875rem' },
        base: { type: String, default: '1rem' },
        lg: { type: String, default: '1.125rem' },
        xl: { type: String, default: '1.25rem' },
        '2xl': { type: String, default: '1.5rem' },
        '3xl': { type: String, default: '1.875rem' },
        '4xl': { type: String, default: '2.25rem' }
      }
    },
    // Spacing
    spacing: {
      xs: { type: String, default: '0.25rem' },
      sm: { type: String, default: '0.5rem' },
      md: { type: String, default: '1rem' },
      lg: { type: String, default: '1.5rem' },
      xl: { type: String, default: '2rem' },
      '2xl': { type: String, default: '3rem' }
    },
    // Border Radius
    borderRadius: {
      sm: { type: String, default: '0.25rem' },
      md: { type: String, default: '0.375rem' },
      lg: { type: String, default: '0.5rem' },
      xl: { type: String, default: '0.75rem' },
      full: { type: String, default: '9999px' }
    },
    // Shadows
    shadows: {
      sm: { type: String, default: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
      md: { type: String, default: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
      lg: { type: String, default: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
      xl: { type: String, default: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }
    },
    // Layouts
    layouts: {
      dashboard: {
        sidebar: { type: String, default: 'left' },
        header: { type: String, default: 'top' },
        grid: { type: String, default: 'auto-fit' }
      },
      forms: {
        layout: { type: String, default: 'vertical' },
        labelPosition: { type: String, default: 'top' }
      }
    },
    // Components
    components: {
      buttons: {
        style: { type: String, default: 'filled' },
        size: { type: String, default: 'md' },
        rounded: { type: Boolean, default: false }
      },
      cards: {
        style: { type: String, default: 'elevated' },
        padding: { type: String, default: 'lg' },
        shadow: { type: String, default: 'md' }
      },
      inputs: {
        style: { type: String, default: 'outlined' },
        size: { type: String, default: 'md' },
        focusStyle: { type: String, default: 'ring' }
      }
    }
  },
  
  // Settings
  settings: {
    workingHours: {
      monday: { closed: { type: Boolean, default: false } },
      tuesday: { closed: { type: Boolean, default: false } },
      wednesday: { closed: { type: Boolean, default: false } },
      thursday: { closed: { type: Boolean, default: false } },
      friday: { closed: { type: Boolean, default: false } },
      saturday: { closed: { type: Boolean, default: true } },
      sunday: { closed: { type: Boolean, default: true } }
    },
    timezone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' },
    timeFormat: { type: String, default: '12h' },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' },
    appointmentDuration: { type: Number, default: 30 },
    autoConfirmAppointments: { type: Boolean, default: false },
    sendSMSNotifications: { type: Boolean, default: false },
    sendEmailNotifications: { type: Boolean, default: true },
    requirePatientConsent: { type: Boolean, default: true }
  },
  
  // Features
  features: {
    appointments: { type: Boolean, default: true },
    patientManagement: { type: Boolean, default: true },
    medicalRecords: { type: Boolean, default: true },
    billing: { type: Boolean, default: false },
    inventory: { type: Boolean, default: false },
    labReports: { type: Boolean, default: false },
    pharmacy: { type: Boolean, default: false },
    telemedicine: { type: Boolean, default: false },
    analytics: { type: Boolean, default: true },
    reports: { type: Boolean, default: true },
    auditLogs: { type: Boolean, default: true }
  },
  
  // Subscription
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'professional', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['trial', 'active', 'suspended', 'cancelled'],
      default: 'trial'
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    maxUsers: { type: Number, default: 5 },
    maxPatients: { type: Number, default: 1000 }
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Generate slug from name before saving
tenantSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  } else if (!this.slug) {
    // Generate a fallback slug if no name is provided
    this.slug = 'tenant-' + Date.now();
  }
  next();
});

// Create indexes (only once to avoid duplicates)
tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Tenant', tenantSchema);
