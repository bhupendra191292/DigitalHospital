import React, { useState, useEffect } from "react";
import { createAppointment, getAppointments, getPatients, updateAppointment, deleteAppointment, registerPatient } from "../services/api";

const PatientManagement = ({ token }) => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showQuickBookingModal, setShowQuickBookingModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: '',
    time: '',
    type: 'Checkup',
    notes: ''
  });
  const [quickBookingData, setQuickBookingData] = useState({
    // Patient Info
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    // Appointment Info
    date: '',
    time: '',
    type: 'Checkup',
    notes: ''
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load patients and appointments
      const [patientsRes, appointmentsRes] = await Promise.all([
        getPatients(),
        getAppointments()
      ]);
      
      setPatients(patientsRes.data.data || []);
      setAppointments(appointmentsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load data', err);
      // Mock data for demo
      setPatients([
        { _id: 1, name: 'John Doe', phone: '1234567890', age: 35, gender: 'Male', lastVisit: '2024-01-15' },
        { _id: 2, name: 'Jane Smith', phone: '0987654321', age: 28, gender: 'Female', lastVisit: '2024-01-10' },
        { _id: 3, name: 'Mike Johnson', phone: '5555555555', age: 45, gender: 'Male', lastVisit: '2024-01-12' }
      ]);
      setAppointments([
        { _id: 1, patient: { name: 'John Doe' }, date: '2024-01-20', time: '10:00', type: 'consultation', status: 'confirmed' },
        { _id: 2, patient: { name: 'Jane Smith' }, date: '2024-01-20', time: '11:00', type: 'follow-up', status: 'pending' },
        { _id: 3, patient: { name: 'Mike Johnson' }, date: '2024-01-21', time: '09:00', type: 'emergency', status: 'confirmed' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        patientId: newAppointment.patientId,
        date: newAppointment.date,
        time: newAppointment.time,
        type: newAppointment.type,
        notes: newAppointment.notes
      };
      
      const res = await createAppointment(appointmentData);
      
      setAppointments([...appointments, res.data.data]);
      setShowAppointmentModal(false);
      setNewAppointment({ patientId: '', date: '', time: '', type: 'Checkup', notes: '' });
    } catch (err) {
      console.error('Failed to create appointment', err);
      alert('Failed to create appointment. Please try again.');
    }
  };

  const handleCallPatient = (appointment) => {
    const phone = appointment.patient?.phone;
    if (phone) {
      window.open(`tel:${phone}`, '_blank');
    } else {
      alert('Phone number not available for this patient.');
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        date: editingAppointment.date,
        time: editingAppointment.time,
        type: editingAppointment.type,
        notes: editingAppointment.notes
      };
      
      const res = await updateAppointment(editingAppointment._id, appointmentData);
      
      // Update the appointment in the list
      setAppointments(appointments.map(apt => 
        apt._id === editingAppointment._id ? res.data.data : apt
      ));
      
      setShowEditModal(false);
      setEditingAppointment(null);
    } catch (err) {
      console.error('Failed to update appointment', err);
      alert('Failed to update appointment. Please try again.');
    }
  };

  const handleCancelAppointment = async (appointment) => {
    if (window.confirm(`Are you sure you want to cancel the appointment for ${appointment.patient?.name} on ${new Date(appointment.date).toLocaleDateString()}?`)) {
      try {
        await deleteAppointment(appointment._id);
        
        // Remove the appointment from the list
        setAppointments(appointments.filter(apt => apt._id !== appointment._id));
        
        alert('Appointment cancelled successfully.');
      } catch (err) {
        console.error('Failed to cancel appointment', err);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  const handleViewPatient = (patient) => {
    // For now, just show patient details in an alert
    // In a real app, this would open a detailed patient view
    alert(`Patient Details:\n\nName: ${patient.name}\nAge: ${patient.age}\nGender: ${patient.gender}\nPhone: ${patient.phone}\nLast Visit: ${patient.lastVisit || 'No previous visits'}`);
  };

  const handleCallPatientDirect = (patient) => {
    if (patient.phone) {
      window.open(`tel:${patient.phone}`, '_blank');
    } else {
      alert('Phone number not available for this patient.');
    }
  };

  const handleScheduleForPatient = (patient) => {
    // Pre-fill the appointment form with the selected patient
    setNewAppointment({
      patientId: patient._id,
      date: '',
      time: '',
      type: 'Checkup',
      notes: ''
    });
    setShowAppointmentModal(true);
  };

  const handleQuickBooking = async (e) => {
    e.preventDefault();
    try {
      // First, check if patient exists by phone number
      const existingPatient = patients.find(p => p.phone === quickBookingData.phone);
      
      let patientId;
      
      if (existingPatient) {
        // Patient exists, use their ID
        patientId = existingPatient._id;
        console.log('Existing patient found:', existingPatient.name);
      } else {
        // Patient doesn't exist, create new patient
        const patientData = {
          name: quickBookingData.name,
          phone: quickBookingData.phone,
          age: parseInt(quickBookingData.age),
          gender: quickBookingData.gender
        };
        
        const patientRes = await registerPatient(patientData);
        patientId = patientRes.data.data._id;
        console.log('New patient created:', patientRes.data.data.name);
        
        // Add new patient to the list
        setPatients([...patients, patientRes.data.data]);
      }
      
      // Now create the appointment
      const appointmentData = {
        patientId: patientId,
        date: quickBookingData.date,
        time: quickBookingData.time,
        type: quickBookingData.type,
        notes: quickBookingData.notes
      };
      
      const appointmentRes = await createAppointment(appointmentData);
      
      // Add appointment to the list
      setAppointments([...appointments, appointmentRes.data.data]);
      
      // Reset form and close modal
      setQuickBookingData({
        name: '',
        phone: '',
        age: '',
        gender: 'Male',
        date: '',
        time: '',
        type: 'Checkup',
        notes: ''
      });
      setShowQuickBookingModal(false);
      
      // Show success message
      const patientName = existingPatient ? existingPatient.name : quickBookingData.name;
      alert(`✅ Appointment booked successfully!\n\nPatient: ${patientName}\nDate: ${new Date(quickBookingData.date).toLocaleDateString()}\nTime: ${quickBookingData.time}\nType: ${quickBookingData.type}`);
      
    } catch (err) {
      console.error('Failed to book appointment:', err);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'No-show': return 'warning';
      default: return 'primary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Consultation': return '👨‍⚕️';
      case 'Follow-up': return '🔄';
      case 'Emergency': return '🚨';
      case 'Checkup': return '🏥';
      case 'Surgery': return '🔪';
      case 'Test': return '🧪';
      case 'Other': return '📋';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-body text-center">
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p className="text-muted mt-4">Loading patient management data...</p>
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
          <h3 className="card-title">👥 Patient Management</h3>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Manage patients, appointments, and medical records
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{patients.length}</div>
              <div className="stat-change positive">+3 this month</div>
            </div>
            <div className="stat-icon primary">👥</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Today's Appointments</div>
              <div className="stat-value">{appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</div>
              <div className="stat-change positive">All confirmed</div>
            </div>
            <div className="stat-icon success">📅</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Pending Appointments</div>
              <div className="stat-value">{appointments.filter(a => a.status === 'pending').length}</div>
              <div className="stat-change warning">Needs confirmation</div>
            </div>
            <div className="stat-icon warning">⏰</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Emergency Cases</div>
              <div className="stat-value">{appointments.filter(a => a.type === 'emergency').length}</div>
              <div className="stat-change error">High priority</div>
            </div>
            <div className="stat-icon error">🚨</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['appointments', 'patients', 'records', 'communication'].map((tab) => (
                <button
                  key={tab}
                  className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'appointments' && '📅 Appointments'}
                  {tab === 'patients' && '👥 Patients'}
                  {tab === 'records' && '📋 Records'}
                  {tab === 'communication' && '💬 Communication'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => setShowQuickBookingModal(true)}
                title="Quick booking for new or existing patients"
              >
                ⚡ Quick Booking
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowAppointmentModal(true)}
              >
                ➕ New Appointment
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-4)' }}>
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="card">
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                        <div>
                          <h4 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>
                            {getTypeIcon(appointment.type)} {appointment.patient?.name || 'Unknown Patient'}
                          </h4>
                          <p style={{ margin: 0, color: 'var(--gray-600)' }}>
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </p>
                        </div>
                        <div className={`badge badge-${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCallPatient(appointment)}
                        >
                          📞 Call
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelAppointment(appointment)}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
                {patients.map((patient) => (
                  <div key={patient._id} className="card">
                    <div className="card-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
                        <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '50%', 
                          background: 'var(--primary-blue)',
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
                          <h4 style={{ margin: 0, marginBottom: 'var(--spacing-1)' }}>{patient.name}</h4>
                          <p style={{ margin: 0, color: 'var(--gray-600)' }}>
                            {patient.age} years • {patient.gender}
                          </p>
                        </div>
                      </div>
                      <div style={{ marginBottom: 'var(--spacing-3)' }}>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
                          📱 {patient.phone}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
                          🏥 Last visit: {patient.lastVisit}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewPatient(patient)}
                        >
                          👁️ View
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleCallPatientDirect(patient)}
                        >
                          📞 Call
                        </button>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleScheduleForPatient(patient)}
                        >
                          📅 Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div>
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">📋 Medical Records</h4>
                </div>
                <div className="card-body">
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>📋</div>
                    <h4>Digital Health Records</h4>
                    <p className="text-muted">Comprehensive medical records system coming soon</p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', marginTop: 'var(--spacing-4)' }}>
                      <button className="btn btn-primary">📊 View Records</button>
                      <button className="btn btn-secondary">📝 Add Entry</button>
                      <button className="btn btn-success">📤 Export</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div>
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">💬 Patient Communication</h4>
                </div>
                <div className="card-body">
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>💬</div>
                    <h4>Patient Messaging System</h4>
                    <p className="text-muted">Secure communication platform for patient care</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                      <button className="btn btn-primary">📱 SMS</button>
                      <button className="btn btn-secondary">📧 Email</button>
                      <button className="btn btn-success">📞 Voice Call</button>
                      <button className="btn btn-warning">📹 Video Call</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
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
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="card-header">
              <h4 className="card-title">📅 Schedule New Appointment</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateAppointment}>
                <div className="form-group">
                  <label className="form-label">Patient *</label>
                  <select
                    className="form-select"
                    value={newAppointment.patientId}
                    onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient._id} value={patient._id}>{patient.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select
                    className="form-select"
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                    required
                  >
                    <option value="Checkup">Checkup</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Test">Test</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Additional notes..."
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
                  <button type="submit" className="btn btn-primary">
                    ✅ Schedule Appointment
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAppointmentModal(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && editingAppointment && (
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
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="card-header">
              <h4 className="card-title">✏️ Edit Appointment</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateAppointment}>
                <div className="form-group">
                  <label className="form-label">Patient</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingAppointment.patient?.name || 'Unknown Patient'}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingAppointment.date ? new Date(editingAppointment.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditingAppointment({...editingAppointment, date: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={editingAppointment.time}
                    onChange={(e) => setEditingAppointment({...editingAppointment, time: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select
                    className="form-select"
                    value={editingAppointment.type}
                    onChange={(e) => setEditingAppointment({...editingAppointment, type: e.target.value})}
                    required
                  >
                    <option value="Checkup">Checkup</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Test">Test</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Additional notes..."
                    value={editingAppointment.notes}
                    onChange={(e) => setEditingAppointment({...editingAppointment, notes: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
                  <button type="submit" className="btn btn-primary">
                    ✅ Update Appointment
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingAppointment(null);
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quick Booking Modal */}
      {showQuickBookingModal && (
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
              <h4 className="card-title">⚡ Quick Appointment Booking</h4>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--gray-600)' }}>
                Book appointment for new or existing patients in one step
              </p>
            </div>
            <div className="card-body">
              <form onSubmit={handleQuickBooking}>
                {/* Patient Information Section */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <h5 style={{ marginBottom: 'var(--spacing-3)', color: 'var(--primary-600)' }}>👤 Patient Information</h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={quickBookingData.name}
                        onChange={(e) => setQuickBookingData({...quickBookingData, name: e.target.value})}
                        placeholder="Enter patient's full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={quickBookingData.phone}
                        onChange={(e) => setQuickBookingData({...quickBookingData, phone: e.target.value})}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Age *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={quickBookingData.age}
                        onChange={(e) => setQuickBookingData({...quickBookingData, age: e.target.value})}
                        placeholder="Enter age"
                        min="1"
                        max="120"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select
                        className="form-select"
                        value={quickBookingData.gender}
                        onChange={(e) => setQuickBookingData({...quickBookingData, gender: e.target.value})}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Appointment Information Section */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <h5 style={{ marginBottom: 'var(--spacing-3)', color: 'var(--primary-600)' }}>📅 Appointment Details</h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={quickBookingData.date}
                        onChange={(e) => setQuickBookingData({...quickBookingData, date: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Time *</label>
                      <input
                        type="time"
                        className="form-input"
                        value={quickBookingData.time}
                        onChange={(e) => setQuickBookingData({...quickBookingData, time: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Appointment Type *</label>
                      <select
                        className="form-select"
                        value={quickBookingData.type}
                        onChange={(e) => setQuickBookingData({...quickBookingData, type: e.target.value})}
                        required
                      >
                        <option value="Checkup">Checkup</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Test">Test</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: 'var(--spacing-4)' }}>
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      placeholder="Additional notes or special requirements..."
                      value={quickBookingData.notes}
                      onChange={(e) => setQuickBookingData({...quickBookingData, notes: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
                  <button type="submit" className="btn btn-primary">
                    ⚡ Book Appointment
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowQuickBookingModal(false);
                      setQuickBookingData({
                        name: '',
                        phone: '',
                        age: '',
                        gender: 'Male',
                        date: '',
                        time: '',
                        type: 'Checkup',
                        notes: ''
                      });
                    }}
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

export default PatientManagement;
