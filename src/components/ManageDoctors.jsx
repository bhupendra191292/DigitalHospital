import React, { useEffect, useState } from "react";
import Modal from '../components/Modal';
import {
  getDoctors,
  updateDoctor,
  deleteDoctor,
  createDoctor
} from "../services/api";
import PhoneInput from "./PhoneInput";

const SPECIALIZATIONS = [
  "General",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic",
  "Gynecologist",
  "Oncologist",
  "Other",
];

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [customSpecialization, setCustomSpecialization] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    phone: '',
    password: '',
    specialization: '',
    customSpecialization: '',
    role: 'doctor'
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data);
    } catch {
      alert("Failed to load doctors");
    }
  };

  const handleCreateDoctor = async () => {
    const specialization = newDoctor.specialization === 'Other'
      ? newDoctor.customSpecialization
      : newDoctor.specialization;

    try {
      await createDoctor({ ...newDoctor, specialization });
      fetchDoctors();
      setShowAddModal(false);
      setNewDoctor({
        name: '',
        phone: '',
        password: '',
        specialization: '',
        customSpecialization: '',
        role: 'doctor'
      });
    } catch (err) {
      alert('Failed to create doctor');
    }
  };

  const handleEdit = (doctor) => {
    setEditing(doctor._id);
    setForm({
      name: doctor.name,
      specialization: SPECIALIZATIONS.includes(doctor.specialization)
        ? doctor.specialization
        : "Other",
      role: doctor.role,
    });
    if (!SPECIALIZATIONS.includes(doctor.specialization)) {
      setCustomSpecialization(doctor.specialization);
    }
  };

  const handleSave = async () => {
    const specialization =
      form.specialization === "Other"
        ? customSpecialization
        : form.specialization;

    try {
      await updateDoctor(editing, {
        name: form.name,
        specialization,
        role: form.role,
      });
      setEditing(null);
      setCustomSpecialization("");
      fetchDoctors();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this doctor?")) return;
    try {
      await deleteDoctor(id);
      fetchDoctors();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h3>🧑‍⚕️ Manage Doctors</h3>

      <button onClick={() => setShowAddModal(true)} style={{ marginBottom: '15px' }}>
        ➕ Add Doctor
      </button>

      {showAddModal && (
  <Modal title="➕ Add New Doctor" onClose={() => setShowAddModal(false)}>
    <form onSubmit={(e) => { e.preventDefault(); handleCreateDoctor(); }}>
      <input
        type="text"
        placeholder="Name"
        value={newDoctor.name}
        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        required
      /><br /><br />
      <PhoneInput
        value={newDoctor.phone}
        onChange={(phoneValue) => setNewDoctor({ ...newDoctor, phone: phoneValue })}
        placeholder="Phone (numbers only)"
        required
      /><br /><br />
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={newDoctor.password}
        onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        style={{ marginLeft: '10px' }}
      >
        {showPassword ? '🙈 Hide' : '👁️ Show'}
      </button>
      <br /><br />

      <select
        value={newDoctor.specialization}
        onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
        required
      >
        <option value="">-- Select Specialization --</option>
        {SPECIALIZATIONS.map((spec) => (
          <option key={spec} value={spec}>{spec}</option>
        ))}
      </select><br /><br />

      {newDoctor.specialization === 'Other' && (
        <input
          type="text"
          placeholder="Custom Specialization"
          value={newDoctor.customSpecialization}
          onChange={(e) => setNewDoctor({ ...newDoctor, customSpecialization: e.target.value })}
          required
        />
      )}<br /><br />

      <select
        value={newDoctor.role}
        onChange={(e) => setNewDoctor({ ...newDoctor, role: e.target.value })}
      >
        <option value="doctor">Doctor</option>
        <option value="admin">Admin</option>
      </select><br /><br />

      <button type="submit">✅ Create</button>
    </form>
  </Modal>
)}

      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td>
                  {editing === doc._id ? (
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  ) : (
                    doc.name
                  )}
                </td>
                <td>{doc.phone}</td>
                <td>
                  {editing === doc._id ? (
                    <>
                      <select
                        value={form.specialization}
                        onChange={(e) =>
                          setForm({ ...form, specialization: e.target.value })
                        }
                      >
                        {SPECIALIZATIONS.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                      {form.specialization === "Other" && (
                        <input
                          style={{ marginTop: '5px' }}
                          placeholder="Custom specialization"
                          value={customSpecialization}
                          onChange={(e) =>
                            setCustomSpecialization(e.target.value)
                          }
                        />
                      )}
                    </>
                  ) : (
                    doc.specialization
                  )}
                </td>
                <td>
                  {editing === doc._id ? (
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    >
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    doc.role
                  )}
                </td>
                <td>
                  {editing === doc._id ? (
                    <>
                      <button onClick={handleSave}>💾 Save</button>
                      <button onClick={() => setEditing(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(doc)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(doc._id)}>🗑️ Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageDoctors;
