import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "./PhoneInput";

const NewPatientForm = ({ onRegister }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "Male",
    address: "",
    role: "admin"
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/api/patients/register", form);
      setSuccess(res.data);

      if (onRegister) {
        onRegister(res.data.phone);
      }

      // Reset form
      setForm({
        name: "",
        phone: "",
        age: "",
        gender: "Male",
        address: "",
        role: "admin"
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in form-container">
      {/* Enhanced Header */}
      <div className="form-header">
        <h2>➕ Register New Patient</h2>
        <p>Add a new patient to the system. All fields marked with * are required.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister}>
        <div className="form-grid">
          {/* Personal Information */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-icon">👤</div>
              <h3 className="form-section-title">Personal Information</h3>
            </div>
            
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter patient's full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <PhoneInput
                name="phone"
                value={form.phone}
                onChange={(value) => setForm({ ...form, phone: value })}
                placeholder="Enter phone number (numbers only)"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                placeholder="Enter age"
                min="0"
                max="150"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-icon">📋</div>
              <h3 className="form-section-title">Additional Information</h3>
            </div>
            
            <div className="form-group">
              <label className="form-label required">Address</label>
              <textarea
                name="address"
                className="form-textarea"
                placeholder="Enter complete address"
                rows="4"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <PhoneInput
                name="emergencyContact"
                onChange={(value) => setForm({ ...form, emergencyContact: value })}
                placeholder="Emergency contact number (numbers only)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical History Notes</label>
              <textarea
                name="medicalNotes"
                className="form-textarea"
                placeholder="Any relevant medical history or notes"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <div className="form-actions-header">
            <div className="form-actions-icon">✅</div>
            <h3 className="form-actions-title">Complete Registration</h3>
          </div>
          
          <div className="form-buttons">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  Registering...
                </>
              ) : (
                <>
                  ✅ Register Patient
                </>
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => {
                setForm({
                  name: "",
                  phone: "",
                  age: "",
                  gender: "Male",
                  address: "",
                  role: "admin"
                });
                setError("");
                setSuccess(null);
              }}
            >
              🔄 Reset Form
            </button>
          </div>
        </div>
      </form>

      {/* Enhanced Success/Error Messages */}
      {success && (
        <div className="message message-success">
          <div className="message-icon">✅</div>
          <div className="message-content">
            <h4>Patient Registered Successfully!</h4>
            <p>{success.name} ({success.phone}) has been added to the system.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="message message-error">
          <div className="message-icon">⚠️</div>
          <div className="message-content">
            <h4>Registration Failed</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Enhanced Tips Section */}
      <div className="tips-section">
        <div className="tips-header">
          <div className="tips-icon">💡</div>
          <h3 className="tips-title">Tips for Registration</h3>
        </div>
        
        <div className="tips-grid">
          <div className="tip-item">
            <div className="tip-icon">📝</div>
            <div className="tip-content">
              <h5>Complete Information</h5>
              <p>Ensure all required fields are filled accurately with valid information.</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">📱</div>
            <div className="tip-content">
              <h5>Phone Number</h5>
              <p>Use a valid phone number for communication and emergency contact.</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">🏠</div>
            <div className="tip-content">
              <h5>Address</h5>
              <p>Provide complete address details for accurate patient records.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPatientForm;
