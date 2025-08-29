import React, { useState, forwardRef } from "react";
import {
  checkPatient,
  getVisits,
  updateVisit,
} from "../services/api";
import PhoneInput from "./PhoneInput";

const PatientSearch = forwardRef(({ token }, ref) => {
  const [phone, setPhone] = useState("");
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Visit form states
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState([
    { medicine: "", dose: "", frequency: "" },
  ]);
  const [reportFile, setReportFile] = useState(null);

  // UI logic states
  const [lastVisit, setLastVisit] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const updatePrescription = (index, field, value) => {
    const updated = [...prescription];
    updated[index][field] = value;
    setPrescription(updated);
  };

  const addPrescriptionField = () => {
    setPrescription([
      ...prescription,
      { medicine: "", dose: "", frequency: "" },
    ]);
  };

  const removePrescriptionField = (index) => {
    if (prescription.length > 1) {
      const updated = prescription.filter((_, i) => i !== index);
      setPrescription(updated);
    }
  };

  const handleAddVisit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("patientId", patient._id);
      formData.append("symptoms", symptoms);
      formData.append("diagnosis", diagnosis);
      formData.append("prescription", JSON.stringify(prescription));
      formData.append("notes", notes);
      if (reportFile) {
        formData.append("report", reportFile);
      }

              const res = await fetch("http://localhost:5001/api/visits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create visit");

      const visitRes = await getVisits(patient._id);
      setVisits(visitRes.data);

      setSymptoms("");
      setDiagnosis("");
      setNotes("");
      setPrescription([{ medicine: "", dose: "", frequency: "" }]);
      setReportFile(null);
      setLastVisit(visitRes.data[visitRes.data.length - 1]);
      setShowEdit(false);
      setActiveTab('history');
    } catch (err) {
      console.error("[Add Visit Error]", err);
      alert("Failed to add visit");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVisit = async () => {
    try {
      setLoading(true);
      await updateVisit(token, lastVisit._id, {
        symptoms,
        diagnosis,
        notes,
        prescription,
      });

      const refreshed = await getVisits(token, patient._id);
      setVisits(refreshed.data);
      setSymptoms("");
      setDiagnosis("");
      setNotes("");
      setPrescription([{ medicine: "", dose: "", frequency: "" }]);
      setShowEdit(false);
      alert("✅ Visit updated successfully!");
    } catch (err) {
      console.error("[Update Visit Error]", err.response?.data || err.message);
      alert("Failed to update visit");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setPatient(null);
    setVisits([]);
    setActiveTab('details');
  
    try {
      setLoading(true);
      const res = await checkPatient(phone);
      setPatient(res.data);
  
      const visitRes = await getVisits(res.data._id);
      setVisits(visitRes.data);
  
      setError("");
    } catch (err) {
      console.error("[Search Error]", err.response?.data || err.message);
      setError(err.response?.data?.message || "Patient not found");
    } finally {
      setLoading(false);
    }
  };

  const searchByPhone = (phoneNumber) => {
    setPhone(phoneNumber);
    // Trigger search after a short delay
    setTimeout(() => {
      const event = { preventDefault: () => {} };
      handleSearch(event);
    }, 100);
  };

  // Expose searchByPhone method to parent component
  if (ref) {
    ref.current = { searchByPhone };
  }

  const getVisitStatus = (visit) => {
    const visitDate = new Date(visit.date);
    const now = new Date();
    const diffDays = Math.floor((now - visitDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { status: 'Today', color: 'success' };
    if (diffDays <= 7) return { status: 'Recent', color: 'primary' };
    if (diffDays <= 30) return { status: 'This Month', color: 'warning' };
    return { status: 'Older', color: 'secondary' };
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="card-title">🔍 Patient Search & Records</h3>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Search for patients by phone number and manage their medical records
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <div className="card-header">
          <h4 className="card-title">📱 Search Patient</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Phone Number</label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                placeholder="Enter patient's phone number (numbers only)"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading" style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }}></div>
                  Searching...
                </>
              ) : (
                '🔍 Search Patient'
              )}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: 'var(--spacing-4)', padding: 'var(--spacing-4)', background: 'var(--error-light)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--error)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <span style={{ fontSize: 'var(--font-size-xl)' }}>⚠️</span>
                <span style={{ color: 'var(--error)' }}>{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {patient && (
        <>
          {/* Patient Overview */}
          <div className="card mb-8">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 className="card-title">👤 Patient Information</h4>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                     <button 
                     className="btn btn-primary btn-sm"
                     onClick={() => setActiveTab('add-visit')}
                   >
                     ➕ Add Visit
                   </button>
                  <button className="btn btn-secondary btn-sm">
                    📞 Call Patient
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                {/* Patient Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      background: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 600
                    }}>
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>{patient.name}</h3>
                      <p style={{ margin: 0, color: 'var(--gray-600)' }}>
                        Patient ID: {patient._id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Age</div>
                      <div style={{ color: 'var(--gray-600)' }}>{patient.age} years</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Gender</div>
                      <div style={{ color: 'var(--gray-600)' }}>{patient.gender}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Phone</div>
                      <div style={{ color: 'var(--gray-600)' }}>{patient.phone}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Total Visits</div>
                      <div style={{ color: 'var(--gray-600)' }}>{visits.length}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h5 style={{ marginBottom: 'var(--spacing-4)' }}>📊 Quick Statistics</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-3)' }}>
                    <div className="stat-card">
                      <div className="stat-header">
                        <div>
                          <div className="stat-label">Total Visits</div>
                          <div className="stat-value">{visits.length}</div>
                        </div>
                        <div className="stat-icon primary">🏥</div>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-header">
                        <div>
                          <div className="stat-label">Last Visit</div>
                          <div className="stat-value">
                            {visits.length > 0 ? new Date(visits[visits.length - 1].date).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <div className="stat-icon success">📅</div>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-header">
                        <div>
                          <div className="stat-label">Reports</div>
                          <div className="stat-value">
                            {visits.filter(v => v.report).length}
                          </div>
                        </div>
                        <div className="stat-icon warning">📋</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {['details', 'history', 'add-visit'].map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'details' && '📋 Patient Details'}
                    {tab === 'history' && '📊 Visit History'}
                    {tab === 'add-visit' && '➕ Add Visit'}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-body">
              {/* Patient Details Tab */}
              {activeTab === 'details' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                    <div>
                      <h5 style={{ marginBottom: 'var(--spacing-4)' }}>📍 Address Information</h5>
                      <div style={{ padding: 'var(--spacing-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
                        <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Current Address</div>
                        <div style={{ color: 'var(--gray-600)' }}>{patient.address}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 style={{ marginBottom: 'var(--spacing-4)' }}>📞 Contact Information</h5>
                      <div style={{ padding: 'var(--spacing-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
                        <div style={{ marginBottom: 'var(--spacing-3)' }}>
                          <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Phone Number</div>
                          <div style={{ color: 'var(--gray-600)' }}>{patient.phone}</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Emergency Contact</div>
                          <div style={{ color: 'var(--gray-600)' }}>Not specified</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Visit History Tab */}
              {activeTab === 'history' && (
                <div>
                  {visits.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                      <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>📋</div>
                      <h4>No Visit History</h4>
                      <p className="text-muted">This patient hasn't had any visits yet.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setActiveTab('add-visit')}
                      >
                        ➕ Add First Visit
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                      {[...visits].reverse().map((visit) => {
                        const visitStatus = getVisitStatus(visit);
                        return (
                          <div key={visit._id} className="card">
                            <div className="card-body">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                                <div>
                                  <h5 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>
                                    🏥 Visit on {new Date(visit.date).toLocaleDateString()}
                                  </h5>
                                  <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)' }}>
                                    {new Date(visit.date).toLocaleTimeString()} • Dr. {visit.doctorId?.name || 'Unknown'}
                                  </p>
                                </div>
                                <div className={`badge badge-${visitStatus.color}`}>
                                  {visitStatus.status}
                                </div>
                              </div>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-3)' }}>
                                <div>
                                  <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Diagnosis</div>
                                  <div style={{ color: 'var(--gray-600)' }}>{visit.diagnosis}</div>
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Symptoms</div>
                                  <div style={{ color: 'var(--gray-600)' }}>{visit.symptoms}</div>
                                </div>
                                {visit.notes && (
                                  <div>
                                    <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Notes</div>
                                    <div style={{ color: 'var(--gray-600)' }}>{visit.notes}</div>
                                  </div>
                                )}
                              </div>
                              
                              {visit.prescription && visit.prescription.length > 0 && (
                                <div style={{ marginBottom: 'var(--spacing-3)' }}>
                                  <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>💊 Prescription</div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-2)' }}>
                                    {visit.prescription.map((med, idx) => (
                                      <div key={idx} style={{ 
                                        padding: 'var(--spacing-2)', 
                                        background: 'var(--gray-50)', 
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--gray-200)'
                                      }}>
                                        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{med.medicine}</div>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-500)' }}>
                                          {med.dose} • {med.frequency}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                {visit.report ? (
                                  <a 
                                    href={`http://localhost:5001${visit.report}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="btn btn-primary btn-sm"
                                  >
                                    📄 View Report
                                  </a>
                                ) : (
                                  <button className="btn btn-secondary btn-sm">
                                    📄 Upload Report
                                  </button>
                                )}
                                <button className="btn btn-warning btn-sm">
                                  ✏️ Edit Visit
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Add Visit Tab */}
              {activeTab === 'add-visit' && (
                <div>
                  <form onSubmit={handleAddVisit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
                      {/* Visit Information */}
                      <div>
                        <h5 style={{ marginBottom: 'var(--spacing-4)' }}>🏥 Visit Information</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                          <div className="form-group">
                            <label className="form-label">Symptoms *</label>
                            <textarea
                              className="form-textarea"
                              rows="3"
                              placeholder="Describe patient symptoms..."
                              value={symptoms}
                              onChange={(e) => setSymptoms(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">Diagnosis *</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter diagnosis"
                              value={diagnosis}
                              onChange={(e) => setDiagnosis(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                              className="form-textarea"
                              rows="3"
                              placeholder="Additional notes..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Prescription */}
                      <div>
                        <h5 style={{ marginBottom: 'var(--spacing-4)' }}>💊 Prescription</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                          {prescription.map((med, idx) => (
                            <div key={idx} style={{ 
                              padding: 'var(--spacing-4)', 
                              background: 'var(--gray-50)', 
                              borderRadius: 'var(--radius-lg)',
                              border: '1px solid var(--gray-200)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                                <div style={{ fontWeight: 600 }}>Medicine #{idx + 1}</div>
                                {prescription.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removePrescriptionField(idx)}
                                  >
                                    ❌ Remove
                                  </button>
                                )}
                              </div>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-3)' }}>
                                <div className="form-group">
                                  <label className="form-label">Medicine *</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Medicine name"
                                    value={med.medicine}
                                    onChange={(e) => updatePrescription(idx, "medicine", e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Dose *</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., 500mg"
                                    value={med.dose}
                                    onChange={(e) => updatePrescription(idx, "dose", e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Frequency *</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Twice daily"
                                    value={med.frequency}
                                    onChange={(e) => updatePrescription(idx, "frequency", e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={addPrescriptionField}
                          >
                            ➕ Add Another Medicine
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div style={{ marginTop: 'var(--spacing-6)' }}>
                      <h5 style={{ marginBottom: 'var(--spacing-4)' }}>📄 Lab Reports</h5>
                      <div className="form-group">
                        <label className="form-label">Upload Report (Optional)</label>
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setReportFile(e.target.files[0])}
                        />
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)', marginTop: 'var(--spacing-1)' }}>
                          Supported formats: PDF, JPG, JPEG, PNG
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
                      {showEdit ? (
                        <button 
                          type="button" 
                          className="btn btn-primary btn-lg"
                          onClick={handleUpdateVisit}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="loading" style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }}></div>
                              Updating...
                            </>
                          ) : (
                            '💾 Save Changes'
                          )}
                        </button>
                      ) : (
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="loading" style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }}></div>
                              Submitting...
                            </>
                          ) : (
                            '✅ Submit Visit'
                          )}
                        </button>
                      )}
                      
                      <button
                        type="button"
                        className="btn btn-secondary btn-lg"
                        onClick={() => {
                          setSymptoms("");
                          setDiagnosis("");
                          setNotes("");
                          setPrescription([{ medicine: "", dose: "", frequency: "" }]);
                          setReportFile(null);
                          setShowEdit(false);
                          setActiveTab('history');
                        }}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default PatientSearch;
