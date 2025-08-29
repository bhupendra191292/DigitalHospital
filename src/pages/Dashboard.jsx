import "../App.css";
import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logoutDoctor } from "../store/slices/authSlice";
import axios from "axios";

import NewPatientForm from "../components/NewPatientForm";
import PatientSearch from "../components/PatientSearch";
import DashboardSummary from "../components/DashboardSummary";
import AnalyticsCharts from "../components/AnalyticsCharts";
import ManageDoctors from "../components/ManageDoctors";
import PatientDirectory from "../components/PatientDirectory";
import PatientManagement from "../components/PatientManagement";
import MedicalRecords from "../components/MedicalRecords";
import PatientCommunication from "../components/PatientCommunication";
import Reports from "../components/Reports";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state?.auth?.doctor);

  const [activeSection, setActiveSection] = useState("summary");
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    setActiveSection("summary");
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setLoadingActivity(true);
      // Simulate API call for recent activity
      const mockActivity = [
        {
          id: 1,
          type: "patient_registered",
          title: "New Patient Registered",
          description: "John Doe was registered to the system",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          icon: "👤",
          color: "primary"
        },
        {
          id: 2,
          type: "appointment_scheduled",
          title: "Appointment Scheduled",
          description: "Appointment scheduled for Sarah Smith",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          icon: "📅",
          color: "success"
        },
        {
          id: 3,
          type: "visit_completed",
          title: "Visit Completed",
          description: "Follow-up visit completed for Mike Johnson",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          icon: "✅",
          color: "success"
        },
        {
          id: 4,
          type: "prescription_updated",
          title: "Prescription Updated",
          description: "Medication updated for Lisa Brown",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          icon: "💊",
          color: "warning"
        }
      ];
      
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error("Error loading recent activity:", error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handlePatientRegistered = (phone) => {
    setActiveSection("search");
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.searchByPhone(phone);
      }
    }, 0);
    // Refresh recent activity
    loadRecentActivity();
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "register":
        setActiveSection("register");
        break;
      case "search":
        setActiveSection("search");
        break;
      case "analytics":
        setActiveSection("analytics");
        break;
      case "appointments":
        setActiveSection("management");
        break;
      default:
        break;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    dispatch(logoutDoctor());
    window.location.href = "/";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const renderSection = () => {
    // Show admin dashboard for admin users on summary
    if (role === "admin" && activeSection === "summary") {
      return <AdminDashboard token={token} />;
    }

    switch (activeSection) {
      case "summary":
        return <DashboardSummary token={token} />;
      case "analytics":
        return <AnalyticsCharts token={token} />;
      case "register":
        return <NewPatientForm onRegister={handlePatientRegistered} />;
      case "search":
        return <PatientSearch token={token} ref={searchRef} />;
      case "doctors":
        return <ManageDoctors token={token} />;
      case 'directory':
        return <PatientDirectory />;
      case 'management':
        return <PatientManagement token={token} />;
      case 'records':
        return <MedicalRecords token={token} />;
      case 'communication':
        return <PatientCommunication token={token} />;
      case 'reports':
        return <Reports token={token} />;
      default:
        return <p>Section not found</p>;
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        id: "summary",
        label: "Dashboard",
        icon: "📊",
        description: "Overview & Statistics"
      }
    ];

    if (role === "admin") {
      // Admin gets full access
      return [
        ...baseItems,
        {
          id: "register",
          label: "Register Patient",
          icon: "➕",
          description: "Add New Patient"
        },
        {
          id: "directory",
          label: "Patient Directory",
          icon: "👥",
          description: "All Patients"
        },
        {
          id: "management",
          label: "Appointment Management",
          icon: "📅",
          description: "Manage All Appointments"
        },
        {
          id: "doctors",
          label: "Manage Doctors",
          icon: "👨‍⚕️",
          description: "Doctor Management"
        },
        {
          id: "records",
          label: "Medical Records",
          icon: "📋",
          description: "Digital Health Records"
        },
        {
          id: "communication",
          label: "Communication",
          icon: "💬",
          description: "Patient Messaging"
        },
        {
          id: "analytics",
          label: "Advanced Analytics",
          icon: "📈",
          description: "Charts & Trends"
        },
        {
          id: "reports",
          label: "Reports",
          icon: "📊",
          description: "Analytics & Insights"
        }
      ];
    } else {
      // Doctor gets limited access
      return [
        ...baseItems,
        {
          id: "search",
          label: "Patient Search",
          icon: "🔍",
          description: "Find Patient Records"
        },
        {
          id: "management",
          label: "My Appointments",
          icon: "📅",
          description: "Manage My Appointments"
        },
        {
          id: "records",
          label: "Medical Records",
          icon: "📋",
          description: "Patient Health Records"
        },
        {
          id: "communication",
          label: "Patient Communication",
          icon: "💬",
          description: "Message Patients"
        },
        {
          id: "reports",
          label: "My Reports",
          icon: "📊",
          description: "My Analytics"
        }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />
      
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-section">
          <div className="header-logo">
            <span className="header-logo-icon">🏥</span>
            <span>Digital Hospital</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Main Menu</div>
          <nav className="sidebar-nav">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  closeMobileMenu();
                }}
                title={`${item.label} - ${item.description}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.7 }}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Account</div>
          <div className="account-card">
            <div className="account-avatar">
              {doctor?.name ? doctor.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="account-info">
              <h4>{doctor?.name || 'Doctor'}</h4>
              <p>{role === 'admin' ? '🏛️ Administrator' : '👨‍⚕️ Medical Professional'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                ☰
              </button>
              <h1>
                {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="header-right">
              <div className="badge badge-primary">
                {role === 'admin' ? 'Administrator' : 'Doctor'}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-content">
          {activeSection === "summary" ? (
            <div className="fade-in">
              {/* Welcome Section */}
              <div className="card section-spacing">
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--font-size-2xl)',
                      color: 'white'
                    }}>
                      👨‍⚕️
                    </div>
                    <div>
                      <h2 style={{ margin: 0, marginBottom: 'var(--spacing-2)' }}>
                        Welcome back, Doctor!
                      </h2>
                      <p style={{ margin: 0, color: 'var(--gray-600)' }}>
                        Here's what's happening at your clinic today
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="section-spacing">
                <DashboardSummary token={token} />
              </div>

              {/* Quick Actions */}
              <div className="card section-spacing">
                <div className="card-header">
                  <h3 className="card-title">🚀 Quick Actions</h3>
                </div>
                <div className="card-body">
                  <div className="quick-actions-grid">
                    <button 
                      className="btn btn-primary btn-lg" 
                      style={{ width: '100%' }}
                      onClick={() => handleQuickAction('register')}
                    >
                      ➕ Register New Patient
                    </button>
                    <button 
                      className="btn btn-secondary btn-lg" 
                      style={{ width: '100%' }}
                      onClick={() => handleQuickAction('search')}
                    >
                      🔍 Search Patients
                    </button>
                    <button 
                      className="btn btn-success btn-lg" 
                      style={{ width: '100%' }}
                      onClick={() => handleQuickAction('analytics')}
                    >
                      📊 View Analytics
                    </button>
                    <button 
                      className="btn btn-secondary btn-lg" 
                      style={{ width: '100%' }}
                      onClick={() => handleQuickAction('appointments')}
                    >
                      📅 Manage Appointments
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">📋 Recent Activity</h3>
                </div>
                <div className="card-body">
                  {loadingActivity ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                      <div className="loading" style={{ margin: '0 auto var(--spacing-4)' }}></div>
                      <p>Loading recent activity...</p>
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="activity-list">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="activity-item">
                          <div className={`activity-icon ${activity.color}`}>
                            {activity.icon}
                          </div>
                          <div className="activity-content">
                            <div className="activity-title">{activity.title}</div>
                            <div className="activity-description">{activity.description}</div>
                            <div className="activity-time">{formatTimeAgo(activity.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                      <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>
                        📋
                      </div>
                      <h4>No Recent Activity</h4>
                      <p className="text-muted">
                        Recent patient visits will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              {renderSection()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
