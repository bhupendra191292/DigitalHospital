import React, { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "./PhoneInput";

const NewPatientForm = ({ onRegister }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "Male",
    address: "",
    email: "",
    bloodGroup: "",
    dob: "",
    emergencyContact: {
      name: "",
      phone: ""
    },
    allergies: [],
    chronicConditions: [],
    medicalNotes: "",
    language: "English"
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Phone validation
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    // Age validation
    if (!form.age) {
      newErrors.age = "Age is required";
    } else if (form.age < 0 || form.age > 150) {
      newErrors.age = "Age must be between 0 and 150";
    }

    // Email validation (optional but if provided, must be valid)
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Address validation
    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Emergency contact validation
    if (form.emergencyContact.name && !form.emergencyContact.phone) {
      newErrors.emergencyContact = "Emergency contact phone is required if name is provided";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !form.allergies.includes(allergyInput.trim())) {
      setForm(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }));
      setAllergyInput("");
    }
  };

  const removeAllergy = (index) => {
    setForm(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addCondition = () => {
    if (conditionInput.trim() && !form.chronicConditions.includes(conditionInput.trim())) {
      setForm(prev => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, conditionInput.trim()]
      }));
      setConditionInput("");
    }
  };

  const removeCondition = (index) => {
    setForm(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((_, i) => i !== index)
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSuccess(null);
    setLoading(true);

    try {
      const patientData = {
        ...form,
        phone: form.phone.replace(/\D/g, ''),
        emergencyContact: {
          name: form.emergencyContact.name || null,
          phone: form.emergencyContact.phone ? form.emergencyContact.phone.replace(/\D/g, '') : null
        }
      };

      const res = await axios.post("http://localhost:5001/api/patients/register", patientData);
      setSuccess(res.data);

      if (onRegister) {
        onRegister(res.data.phone);
      }

      // Reset form
      resetForm();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      age: "",
      gender: "Male",
      address: "",
      email: "",
      bloodGroup: "",
      dob: "",
      emergencyContact: {
        name: "",
        phone: ""
      },
      allergies: [],
      chronicConditions: [],
      medicalNotes: "",
      language: "English"
    });
    setErrors({});
    setSuccess(null);
    setAllergyInput("");
    setConditionInput("");
  };

  return (
    <div className="fade-in form-container">
      {/* Enhanced Header */}
      <div className="form-header">
        <h2>➕ Register New Patient</h2>
        <p>Add a new patient to the system with comprehensive medical information.</p>
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
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter patient's full name"
                value={form.name}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <PhoneInput
                name="phone"
                value={form.phone}
                onChange={(value) => setForm({ ...form, phone: value })}
                placeholder="Enter phone number"
                required
                error={errors.phone}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Age</label>
                <input
                  type="number"
                  name="age"
                  className={`form-input ${errors.age ? 'error' : ''}`}
                  placeholder="Age"
                  min="0"
                  max="150"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
                {errors.age && <div className="error-message">{errors.age}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className="form-input"
                  value={form.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
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

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  className="form-select"
                  value={form.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address (optional)"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required">Address</label>
              <textarea
                name="address"
                className={`form-textarea ${errors.address ? 'error' : ''}`}
                placeholder="Enter complete address"
                rows="3"
                value={form.address}
                onChange={handleChange}
                required
              />
              {errors.address && <div className="error-message">{errors.address}</div>}
            </div>
          </div>

          {/* Medical Information */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-icon">🏥</div>
              <h3 className="form-section-title">Medical Information</h3>
            </div>
            
            <div className="form-group">
              <label className="form-label">Allergies</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add allergy (e.g., Penicillin, Latex)"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addAllergy}
                >
                  ➕ Add
                </button>
              </div>
              {form.allergies.length > 0 && (
                <div className="tags-container">
                  {form.allergies.map((allergy, index) => (
                    <span key={index} className="tag">
                      {allergy}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeAllergy(index)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Chronic Conditions</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add condition (e.g., Diabetes, Hypertension)"
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addCondition}
                >
                  ➕ Add
                </button>
              </div>
              {form.chronicConditions.length > 0 && (
                <div className="tags-container">
                  {form.chronicConditions.map((condition, index) => (
                    <span key={index} className="tag">
                      {condition}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeCondition(index)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Medical Notes</label>
              <textarea
                name="medicalNotes"
                className="form-textarea"
                placeholder="Any relevant medical history, current medications, or important notes"
                rows="4"
                value={form.medicalNotes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-icon">🚨</div>
              <h3 className="form-section-title">Emergency Contact</h3>
            </div>
            
            <div className="form-group">
              <label className="form-label">Emergency Contact Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Emergency contact person's name"
                value={form.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact Phone</label>
              <PhoneInput
                value={form.emergencyContact.phone}
                onChange={(value) => handleEmergencyContactChange('phone', value)}
                placeholder="Emergency contact phone number"
                error={errors.emergencyContact}
              />
              {errors.emergencyContact && <div className="error-message">{errors.emergencyContact}</div>}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <div className="form-actions-header">
            <div className="form-actions-icon">✅</div>
            <h3 className="form-actions-title">Complete Registration</h3>
          </div>
          
          {errors.general && (
            <div className="message message-error">
              <div className="message-icon">⚠️</div>
              <div className="message-content">
                <h4>Registration Error</h4>
                <p>{errors.general}</p>
              </div>
            </div>
          )}
          
          <div className="form-buttons">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  Registering Patient...
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
              onClick={resetForm}
            >
              🔄 Reset Form
            </button>
          </div>
        </div>
      </form>

      {/* Enhanced Success Message */}
      {success && (
        <div className="message message-success">
          <div className="message-icon">✅</div>
          <div className="message-content">
            <h4>Patient Registered Successfully!</h4>
            <p><strong>{success.name}</strong> (ID: {success.patientId}) has been added to the system.</p>
            <p>Phone: {success.phone}</p>
          </div>
        </div>
      )}

      {/* Enhanced Tips Section */}
      <div className="tips-section">
        <div className="tips-header">
          <div className="tips-icon">💡</div>
          <h3 className="tips-title">Registration Guidelines</h3>
        </div>
        
        <div className="tips-grid">
          <div className="tip-item">
            <div className="tip-icon">📝</div>
            <div className="tip-content">
              <h5>Complete Information</h5>
              <p>Fill all required fields accurately. Medical information helps provide better care.</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">📱</div>
            <div className="tip-content">
              <h5>Phone Verification</h5>
              <p>Ensure phone numbers are correct for appointment reminders and emergency contact.</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">🏥</div>
            <div className="tip-content">
              <h5>Medical History</h5>
              <p>Include allergies and chronic conditions for safe treatment planning.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPatientForm;
