import React, { useState, useEffect } from "react";
import axios from "axios";

const Reports = ({ token }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock reports data
      setReports([
        {
          id: 1,
          type: 'patient_summary',
          title: 'Patient Summary Report',
          description: 'Comprehensive overview of patient demographics and trends',
          lastGenerated: '2024-01-19T10:30:00Z',
          status: 'completed',
          format: 'pdf'
        },
        {
          id: 2,
          type: 'financial_summary',
          title: 'Financial Summary Report',
          description: 'Revenue analysis and financial performance metrics',
          lastGenerated: '2024-01-18T15:45:00Z',
          status: 'completed',
          format: 'excel'
        },
        {
          id: 3,
          type: 'appointment_analysis',
          title: 'Appointment Analysis Report',
          description: 'Appointment trends and scheduling efficiency',
          lastGenerated: '2024-01-17T14:20:00Z',
          status: 'completed',
          format: 'pdf'
        },
        {
          id: 4,
          type: 'medical_conditions',
          title: 'Medical Conditions Report',
          description: 'Analysis of common conditions and treatments',
          lastGenerated: '2024-01-16T09:15:00Z',
          status: 'completed',
          format: 'pdf'
        }
      ]);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType) => {
    try {
      // Simulate report generation
      const newReport = {
        id: reports.length + 1,
        type: reportType,
        title: `${reportType.replace('_', ' ').toUpperCase()} Report`,
        description: `Automated ${reportType.replace('_', ' ')} report`,
        lastGenerated: new Date().toISOString(),
        status: 'generating',
        format: 'pdf'
      };
      
      setReports([newReport, ...reports]);
      
      // Simulate processing time
      setTimeout(() => {
        setReports(prev => prev.map(r => 
          r.id === newReport.id ? { ...r, status: 'completed' } : r
        ));
      }, 3000);
    } catch (err) {
      console.error('Failed to generate report', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'generating': return 'warning';
      case 'failed': return 'error';
      default: return 'primary';
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'csv': return '📋';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-body text-center">
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p className="text-muted mt-4">Loading reports system...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="card-title">📊 Reports & Analytics</h3>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Automated reports, insights, and data analytics for informed decision making
          </p>
        </div>
      </div>

      {/* Report Stats */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Total Reports</div>
              <div className="stat-value">{reports.length}</div>
              <div className="stat-change positive">+2 this week</div>
            </div>
            <div className="stat-icon primary">📊</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Completed</div>
              <div className="stat-value">{reports.filter(r => r.status === 'completed').length}</div>
              <div className="stat-change positive">100% success rate</div>
            </div>
            <div className="stat-icon success">✅</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Generating</div>
              <div className="stat-value">{reports.filter(r => r.status === 'generating').length}</div>
              <div className="stat-change warning">In progress</div>
            </div>
            <div className="stat-icon warning">⏳</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Export Formats</div>
              <div className="stat-value">3</div>
              <div className="stat-change positive">PDF, Excel, CSV</div>
            </div>
            <div className="stat-icon info">📤</div>
          </div>
        </div>
      </div>

      {/* Main Reports Interface */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['overview', 'reports', 'insights', 'exports'].map((tab) => (
                <button
                  key={tab}
                  className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'reports' && '📋 Reports'}
                  {tab === 'insights' && '💡 Insights'}
                  {tab === 'exports' && '📤 Exports'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  className={`btn btn-sm ${dateRange === range ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDateRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
                {/* Key Metrics */}
                <div>
                  <h5 style={{ marginBottom: 'var(--spacing-4)' }}>📈 Key Performance Indicators</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    <div style={{ 
                      padding: 'var(--spacing-4)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--gray-200)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Patient Growth</div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                            +15.2% this month
                          </div>
                        </div>
                        <div style={{ fontSize: 'var(--font-size-2xl)' }}>📈</div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: 'var(--spacing-4)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--gray-200)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Revenue Growth</div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                            +8.5% this month
                          </div>
                        </div>
                        <div style={{ fontSize: 'var(--font-size-2xl)' }}>💰</div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: 'var(--spacing-4)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--gray-200)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Patient Satisfaction</div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                            4.8/5 average rating
                          </div>
                        </div>
                        <div style={{ fontSize: 'var(--font-size-2xl)' }}>⭐</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Reports */}
                <div>
                  <h5 style={{ marginBottom: 'var(--spacing-4)' }}>📋 Recent Reports</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                    {reports.slice(0, 3).map((report) => (
                      <div key={report.id} className="card">
                        <div className="card-body">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                            <div>
                              <h6 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>
                                {getFormatIcon(report.format)} {report.title}
                              </h6>
                              <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                {new Date(report.lastGenerated).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`badge badge-${getStatusColor(report.status)}`}>
                              {report.status}
                            </div>
                          </div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                            {report.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-4)' }}>
                {reports.map((report) => (
                  <div key={report.id} className="card">
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                        <div>
                          <h5 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>
                            {getFormatIcon(report.format)} {report.title}
                          </h5>
                          <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
                            {report.description}
                          </p>
                        </div>
                        <div className={`badge badge-${getStatusColor(report.status)}`}>
                          {report.status}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: 'var(--spacing-3)' }}>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
                          Last generated: {new Date(report.lastGenerated).toLocaleString()}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button className="btn btn-primary btn-sm">
                          📄 View
                        </button>
                        <button className="btn btn-secondary btn-sm">
                          📤 Download
                        </button>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => generateReport(report.type)}
                        >
                          🔄 Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>💡</div>
                <h4>AI-Powered Insights</h4>
                <p className="text-muted">Intelligent analytics and predictive insights for better decision making</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                  <button className="btn btn-primary">📊 Patient Trends</button>
                  <button className="btn btn-secondary">💰 Revenue Insights</button>
                  <button className="btn btn-success">🏥 Clinical Analytics</button>
                  <button className="btn btn-warning">📈 Predictive Analysis</button>
                </div>
              </div>
            </div>
          )}

          {/* Exports Tab */}
          {activeTab === 'exports' && (
            <div>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>📤</div>
                <h4>Data Export & Integration</h4>
                <p className="text-muted">Export data in multiple formats and integrate with external systems</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                  <button className="btn btn-primary">📄 Export PDF</button>
                  <button className="btn btn-secondary">📊 Export Excel</button>
                  <button className="btn btn-success">📋 Export CSV</button>
                  <button className="btn btn-warning">🔗 API Integration</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mt-8">
        <div className="card-header">
          <h4 className="card-title">🚀 Quick Actions</h4>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
            <button 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
              onClick={() => generateReport('patient_summary')}
            >
              📊 Generate Patient Report
            </button>
            <button 
              className="btn btn-success btn-lg" 
              style={{ width: '100%' }}
              onClick={() => generateReport('financial_summary')}
            >
              💰 Generate Financial Report
            </button>
            <button 
              className="btn btn-secondary btn-lg" 
              style={{ width: '100%' }}
              onClick={() => generateReport('appointment_analysis')}
            >
              📅 Generate Appointment Report
            </button>
            <button 
              className="btn btn-warning btn-lg" 
              style={{ width: '100%' }}
              onClick={() => generateReport('medical_conditions')}
            >
              🏥 Generate Medical Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
