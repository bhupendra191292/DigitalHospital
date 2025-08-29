import React, { useState, useEffect } from 'react';
import { getAdminDashboard } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = ({ token }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboard();
      setDashboardData(response.data.data);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <LoadingSpinner size="large" color="primary" />
          <p className="mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="text-danger">❌ {error}</div>
          <button className="btn btn-primary mt-3" onClick={loadDashboardData}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="text-muted">No dashboard data available</div>
        </div>
      </div>
    );
  }

  const { overview, auditStats, recentActivity, systemHealth, monthlyStats, doctorPerformance, appointmentAnalytics } = dashboardData;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">🏛️ Admin Dashboard</h3>
          <p className="text-muted mb-0">Comprehensive system overview and analytics</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="nav-tabs">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' },
              { id: 'performance', label: '🏆 Performance', icon: '🏆' },
              { id: 'audit', label: '🔍 Audit Logs', icon: '🔍' },
              { id: 'system', label: '⚙️ System', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="overview-section">
          {/* Key Metrics */}
          <div className="stats-grid mb-4">
            <div className="stat-card primary">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-content">
                <div className="stat-value">{overview.totalDoctors}</div>
                <div className="stat-label">Total Doctors</div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">{overview.totalPatients}</div>
                <div className="stat-label">Total Patients</div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <div className="stat-value">{overview.totalAppointments}</div>
                <div className="stat-label">Total Appointments</div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{auditStats.totalActions}</div>
                <div className="stat-label">Total Actions</div>
              </div>
            </div>
          </div>

          {/* Today's Activity */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>📅 Today's Activity</h5>
            </div>
            <div className="card-body">
              <div className="today-stats">
                <div className="today-stat">
                  <span className="stat-number">{overview.todayAppointments}</span>
                  <span className="stat-label">Appointments</span>
                </div>
                <div className="today-stat">
                  <span className="stat-number">{overview.todayPatients}</span>
                  <span className="stat-label">New Patients</span>
                </div>
                <div className="today-stat">
                  <span className="stat-number">{overview.todayLogins}</span>
                  <span className="stat-label">Logins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h5>🕒 Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.action === 'LOGIN' && '🔐'}
                      {activity.action === 'CREATE_DOCTOR' && '👨‍⚕️'}
                      {activity.action === 'CREATE_PATIENT' && '👤'}
                      {activity.action === 'CREATE_APPOINTMENT' && '📅'}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">
                        {activity.actionDescription}
                      </div>
                      <div className="activity-meta">
                        by {activity.performedBy?.name || 'System'} • {new Date(activity.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className={`activity-status ${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="analytics-section">
          {/* Monthly Trends */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>📈 Monthly Trends</h5>
            </div>
            <div className="card-body">
              <div className="monthly-chart">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="month-bar">
                    <div className="bar-label">{stat.month}</div>
                    <div className="bar-container">
                      <div 
                        className="bar patients" 
                        style={{ height: `${(stat.patients / Math.max(...monthlyStats.map(s => s.patients))) * 100}%` }}
                      ></div>
                      <div 
                        className="bar appointments" 
                        style={{ height: `${(stat.appointments / Math.max(...monthlyStats.map(s => s.appointments))) * 100}%` }}
                      ></div>
                    </div>
                    <div className="bar-stats">
                      <div>👤 {stat.patients}</div>
                      <div>📅 {stat.appointments}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Appointment Analytics */}
          <div className="card">
            <div className="card-header">
              <h5>📊 Appointment Analytics</h5>
            </div>
            <div className="card-body">
              <div className="analytics-grid">
                <div className="analytics-section">
                  <h6>Appointment Types</h6>
                  {Object.entries(appointmentAnalytics.typeStats).map(([type, count]) => (
                    <div key={type} className="analytics-item">
                      <span>{type}</span>
                      <span className="count">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="analytics-section">
                  <h6>Appointment Status</h6>
                  {Object.entries(appointmentAnalytics.statusStats).map(([status, count]) => (
                    <div key={status} className="analytics-item">
                      <span>{status}</span>
                      <span className="count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="performance-section">
          <div className="card">
            <div className="card-header">
              <h5>🏆 Doctor Performance</h5>
            </div>
            <div className="card-body">
              <div className="performance-list">
                {doctorPerformance.map((doctor, index) => (
                  <div key={doctor.doctorId} className="performance-item">
                    <div className="rank">#{index + 1}</div>
                    <div className="doctor-info">
                      <div className="doctor-name">{doctor.name}</div>
                      <div className="doctor-specialization">{doctor.specialization}</div>
                    </div>
                    <div className="performance-stats">
                      <div className="stat">
                        <span className="label">Total:</span>
                        <span className="value">{doctor.totalAppointments}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Completed:</span>
                        <span className="value">{doctor.completedAppointments}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Rate:</span>
                        <span className="value">{doctor.completionRate}%</span>
                      </div>
                    </div>
                    <div className="performance-bar">
                      <div 
                        className="completion-bar" 
                        style={{ width: `${doctor.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="system-section">
          <div className="card">
            <div className="card-header">
              <h5>⚙️ System Health</h5>
            </div>
            <div className="card-body">
              <div className="system-health">
                <div className={`health-status ${systemHealth.status}`}>
                  <div className="status-indicator"></div>
                  <div className="status-info">
                    <div className="status-title">System Status: {systemHealth.status.toUpperCase()}</div>
                    <div className="status-details">
                      Error Rate: {systemHealth.errorRate}% | 
                      Recent Activity: {systemHealth.recentActivity} actions
                    </div>
                  </div>
                </div>
                <div className="system-stats">
                  <div className="stat">
                    <span className="label">Last Checked:</span>
                    <span className="value">{new Date(systemHealth.lastChecked).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
