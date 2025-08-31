import React, { useState, useEffect } from "react";
import axios from "axios";

const MedicalRecords = ({ token }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'consultation',
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
    followUpDate: ''
  });

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
      
      // Get real medical records from backend
      const recordsRes = await axios.get('http://localhost:5001/api/visits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMedicalRecords(recordsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load data', err);
      setPatients([]);
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      const recordData = {
        ...newRecord,
        patientId: selectedPatient.id,
        date: new Date().toISOString().split('T')[0]
      };
      
      // In a real app, this would be an API call
      const newRecordWithId = {
        ...recordData,
        id: medicalRecords.length + 1
      };
      
      setMedicalRecords([newRecordWithId, ...medicalRecords]);
      setShowRecordModal(false);
      setNewRecord({
        type: 'consultation',
        diagnosis: '',
        treatment: '',
        prescription: '',
        notes: '',
        followUpDate: ''
      });
    } catch (err) {
      console.error('Failed to create record', err);
    }
  };

  const getPatientRecords = (patientId) => {
    return medicalRecords.filter(record => record.patientId === patientId);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation': return '👨‍⚕️';
      case 'follow-up': return '🔄';
      case 'emergency': return '🚨';
      case 'surgery': return '🔪';
      case 'lab-test': return '🧪';
      default: return '📋';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'consultation': return 'primary';
      case 'follow-up': return 'success';
      case 'emergency': return 'error';
      case 'surgery': return 'warning';
      case 'lab-test': return 'info';
      default: return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-body text-center">
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p className="text-muted mt-4">Loading medical records...</p>
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
          <h3 className="card-title">📋 Digital Health Records</h3>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Comprehensive medical records and patient history management
          </p>
        </div>
      </div>

      {/* Patient Selection */}
      <div className="card mb-8">
        <div className="card-header">
          <h4 className="card-title">👥 Select Patient</h4>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
            {patients.map((patient) => (
              <div
                key={patient.id}
                className={`card ${selectedPatient?.id === patient.id ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer', transition: 'all var(--transition-normal)' }}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      background: selectedPatient?.id === patient.id ? 'var(--primary-blue)' : 'var(--gray-300)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 600
                    }}>
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h5 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>{patient.name}</h5>
                      <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPatient && (
        <>
          {/* Patient Overview */}
          <div className="card mb-8">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 className="card-title">📊 {selectedPatient.name} - Medical Overview</h4>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowRecordModal(true)}
                >
                  ➕ Add Record
                </button>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-label">Total Records</div>
                      <div className="stat-value">{getPatientRecords(selectedPatient.id).length}</div>
                    </div>
                    <div className="stat-icon primary">📋</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-label">Last Visit</div>
                      <div className="stat-value">
                        {getPatientRecords(selectedPatient.id)[0]?.date || 'N/A'}
                      </div>
                    </div>
                    <div className="stat-icon success">📅</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-label">Active Conditions</div>
                      <div className="stat-value">
                        {new Set(getPatientRecords(selectedPatient.id).map(r => r.diagnosis)).size}
                      </div>
                    </div>
                    <div className="stat-icon warning">🏥</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-label">Next Follow-up</div>
                      <div className="stat-value">
                        {getPatientRecords(selectedPatient.id).find(r => r.followUpDate)?.followUpDate || 'N/A'}
                      </div>
                    </div>
                    <div className="stat-icon info">⏰</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Records Tabs */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {['overview', 'history', 'treatments', 'prescriptions'].map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'overview' && '📊 Overview'}
                    {tab === 'history' && '📋 History'}
                    {tab === 'treatments' && '💊 Treatments'}
                    {tab === 'prescriptions' && '💊 Prescriptions'}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-body">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
                    {/* Recent Records */}
                    <div>
                      <h5 style={{ marginBottom: 'var(--spacing-4)' }}>📋 Recent Medical Records</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        {getPatientRecords(selectedPatient.id).slice(0, 3).map((record) => (
                          <div key={record.id} className="card">
                            <div className="card-body">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                                <div>
                                  <h6 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>
                                    {getTypeIcon(record.type)} {record.type}
                                  </h6>
                                  <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                    {record.date}
                                  </p>
                                </div>
                                <div className={`badge badge-${getTypeColor(record.type)}`}>
                                  {record.type}
                                </div>
                              </div>
                              <div style={{ fontSize: 'var(--font-size-sm)' }}>
                                <strong>Diagnosis:</strong> {record.diagnosis}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Conditions */}
                    <div>
                      <h5 style={{ marginBottom: 'var(--spacing-4)' }}>🏥 Active Medical Conditions</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        {Array.from(new Set(getPatientRecords(selectedPatient.id).map(r => r.diagnosis))).map((diagnosis, index) => (
                          <div key={index} style={{ 
                            padding: 'var(--spacing-3)',
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--gray-200)'
                          }}>
                            <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>
                              {diagnosis}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                              Last treated: {getPatientRecords(selectedPatient.id).find(r => r.diagnosis === diagnosis)?.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {getPatientRecords(selectedPatient.id).map((record) => (
                      <div key={record.id} className="card">
                        <div className="card-body">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                            <div>
                              <h5 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>
                                {getTypeIcon(record.type)} {record.type} - {record.date}
                              </h5>
                              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                                Follow-up: {record.followUpDate || 'Not scheduled'}
                              </div>
                            </div>
                            <div className={`badge badge-${getTypeColor(record.type)}`}>
                              {record.type}
                            </div>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-3)' }}>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Diagnosis</div>
                              <div>{record.diagnosis}</div>
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Treatment</div>
                              <div>{record.treatment}</div>
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Prescription</div>
                              <div>{record.prescription || 'None'}</div>
                            </div>
                          </div>
                          
                          {record.notes && (
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Notes</div>
                              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                                {record.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatments Tab */}
              {activeTab === 'treatments' && (
                <div>
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>💊</div>
                    <h4>Treatment Plans</h4>
                    <p className="text-muted">Detailed treatment plans and progress tracking</p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', marginTop: 'var(--spacing-4)' }}>
                      <button className="btn btn-primary">📊 View Plans</button>
                      <button className="btn btn-secondary">📝 Add Treatment</button>
                      <button className="btn btn-success">📈 Track Progress</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Prescriptions Tab */}
              {activeTab === 'prescriptions' && (
                <div>
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>💊</div>
                    <h4>Prescription Management</h4>
                    <p className="text-muted">Digital prescription system and medication tracking</p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', marginTop: 'var(--spacing-4)' }}>
                      <button className="btn btn-primary">💊 View Prescriptions</button>
                      <button className="btn btn-secondary">📝 New Prescription</button>
                      <button className="btn btn-success">📤 Send to Pharmacy</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Record Modal */}
      {showRecordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="card-header">
              <h4 className="card-title">📝 Add Medical Record</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateRecord}>
                <div className="form-group">
                  <label className="form-label">Record Type *</label>
                  <select
                    className="form-select"
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                    required
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="surgery">Surgery</option>
                    <option value="lab-test">Lab Test</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Diagnosis *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter diagnosis"
                    value={newRecord.diagnosis}
                    onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Treatment Plan *</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe treatment plan"
                    value={newRecord.treatment}
                    onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prescription</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Enter prescription details"
                    value={newRecord.prescription}
                    onChange={(e) => setNewRecord({...newRecord, prescription: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Follow-up Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newRecord.followUpDate}
                    onChange={(e) => setNewRecord({...newRecord, followUpDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Additional notes..."
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
                  <button type="submit" className="btn btn-primary">
                    ✅ Save Record
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowRecordModal(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
