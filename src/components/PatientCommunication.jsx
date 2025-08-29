import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientCommunication = ({ token }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [communicationType, setCommunicationType] = useState('sms');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5001/api/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPatients(res.data.data || []);
      
      // Mock messages data
      setMessages([
        {
          id: 1,
          patientId: 1,
          type: 'sms',
          content: 'Your appointment is confirmed for tomorrow at 10:00 AM',
          timestamp: '2024-01-19T10:30:00Z',
          status: 'sent'
        },
        {
          id: 2,
          patientId: 1,
          type: 'email',
          content: 'Please remember to bring your medical reports for the follow-up visit',
          timestamp: '2024-01-18T15:45:00Z',
          status: 'delivered'
        },
        {
          id: 3,
          patientId: 2,
          type: 'sms',
          content: 'Your prescription has been sent to the pharmacy',
          timestamp: '2024-01-17T14:20:00Z',
          status: 'sent'
        }
      ]);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPatient) return;

    try {
      const messageData = {
        patientId: selectedPatient.id,
        type: communicationType,
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: 'sending'
      };

      // In a real app, this would be an API call
      const newMessageWithId = {
        ...messageData,
        id: messages.length + 1
      };

      setMessages([newMessageWithId, ...messages]);
      setNewMessage('');
      
      // Simulate sending
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessageWithId.id ? { ...msg, status: 'sent' } : msg
        ));
      }, 1000);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const getPatientMessages = (patientId) => {
    return messages.filter(message => message.patientId === patientId);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sms': return '📱';
      case 'email': return '📧';
      case 'voice': return '📞';
      case 'video': return '📹';
      default: return '💬';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'success';
      case 'delivered': return 'primary';
      case 'read': return 'info';
      case 'failed': return 'error';
      default: return 'warning';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-body text-center">
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p className="text-muted mt-4">Loading communication system...</p>
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
          <h3 className="card-title">💬 Patient Communication</h3>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Secure messaging and communication platform for patient care
          </p>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Total Messages</div>
              <div className="stat-value">{messages.length}</div>
              <div className="stat-change positive">+5 today</div>
            </div>
            <div className="stat-icon primary">💬</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">SMS Sent</div>
              <div className="stat-value">{messages.filter(m => m.type === 'sms').length}</div>
              <div className="stat-change positive">98% delivery rate</div>
            </div>
            <div className="stat-icon success">📱</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Emails Sent</div>
              <div className="stat-value">{messages.filter(m => m.type === 'email').length}</div>
              <div className="stat-change positive">95% open rate</div>
            </div>
            <div className="stat-icon warning">📧</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Active Patients</div>
              <div className="stat-value">{patients.length}</div>
              <div className="stat-change positive">All reachable</div>
            </div>
            <div className="stat-icon info">👥</div>
          </div>
        </div>
      </div>

      {/* Main Communication Interface */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['messages', 'notifications', 'reminders', 'templates'].map((tab) => (
                <button
                  key={tab}
                  className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'messages' && '💬 Messages'}
                  {tab === 'notifications' && '🔔 Notifications'}
                  {tab === 'reminders' && '⏰ Reminders'}
                  {tab === 'templates' && '📝 Templates'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--spacing-6)' }}>
              {/* Patient List */}
              <div>
                <h5 style={{ marginBottom: 'var(--spacing-4)' }}>👥 Patients</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`card ${selectedPatient?.id === patient.id ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer', transition: 'all var(--transition-normal)' }}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            background: selectedPatient?.id === patient.id ? 'var(--primary-blue)' : 'var(--gray-300)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 'var(--font-size-lg)',
                            fontWeight: 600
                          }}>
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{patient.name}</div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-500)' }}>
                              {getPatientMessages(patient.id).length} messages
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Interface */}
              <div>
                {selectedPatient ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                      <h5>💬 {selectedPatient.name}</h5>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button className="btn btn-primary btn-sm">📞 Call</button>
                        <button className="btn btn-secondary btn-sm">📧 Email</button>
                        <button className="btn btn-success btn-sm">📹 Video</button>
                      </div>
                    </div>

                    {/* Message History */}
                    <div style={{ 
                      height: '400px', 
                      overflowY: 'auto', 
                      border: '1px solid var(--gray-200)', 
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--spacing-4)',
                      marginBottom: 'var(--spacing-4)',
                      background: 'var(--gray-50)'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        {getPatientMessages(selectedPatient.id).map((message) => (
                          <div key={message.id} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            padding: 'var(--spacing-3)',
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--gray-200)'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                                <span>{getTypeIcon(message.type)}</span>
                                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
                                  {formatTimestamp(message.timestamp)}
                                </span>
                              </div>
                              <div style={{ fontSize: 'var(--font-size-sm)' }}>{message.content}</div>
                            </div>
                            <div className={`badge badge-${getStatusColor(message.status)}`}>
                              {message.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Send Message */}
                    <form onSubmit={handleSendMessage}>
                      <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label">Message</label>
                          <textarea
                            className="form-textarea"
                            rows="3"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Type</label>
                          <select
                            className="form-select"
                            value={communicationType}
                            onChange={(e) => setCommunicationType(e.target.value)}
                          >
                            <option value="sms">📱 SMS</option>
                            <option value="email">📧 Email</option>
                            <option value="voice">📞 Voice</option>
                            <option value="video">📹 Video</option>
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary">
                          📤 Send
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>💬</div>
                    <h4>Select a Patient</h4>
                    <p className="text-muted">Choose a patient from the list to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>🔔</div>
                <h4>Smart Notifications</h4>
                <p className="text-muted">Automated patient notifications and alerts</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                  <button className="btn btn-primary">📅 Appointment Reminders</button>
                  <button className="btn btn-secondary">💊 Medication Alerts</button>
                  <button className="btn btn-success">🏥 Test Results</button>
                  <button className="btn btn-warning">📋 Follow-up Notifications</button>
                </div>
              </div>
            </div>
          )}

          {/* Reminders Tab */}
          {activeTab === 'reminders' && (
            <div>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>⏰</div>
                <h4>Appointment Reminders</h4>
                <p className="text-muted">Automated reminder system for better patient engagement</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                  <button className="btn btn-primary">📅 Schedule Reminders</button>
                  <button className="btn btn-secondary">📱 SMS Reminders</button>
                  <button className="btn btn-success">📧 Email Reminders</button>
                  <button className="btn btn-warning">🔔 Push Notifications</button>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>📝</div>
                <h4>Message Templates</h4>
                <p className="text-muted">Pre-written templates for common communications</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                  <button className="btn btn-primary">📅 Appointment Confirmation</button>
                  <button className="btn btn-secondary">💊 Medication Instructions</button>
                  <button className="btn btn-success">🏥 Test Results</button>
                  <button className="btn btn-warning">📋 Follow-up Instructions</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientCommunication;
