import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById } from "../services/api";
import "./PatientProfile.css"; // custom styles here
import { FaUserMd } from "react-icons/fa";

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [tab, setTab] = useState("info");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPatientById(id);
        setPatient(res.data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    };
    fetch();
  }, [id]);

  if (!patient) return <p className="loading">Loading patient profile...</p>;

  const latestDiagnosis = patient.visits?.map(v => ({
    date: v.date,
    diagnosis: v.diagnosis,
  })) || [];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <FaUserMd className="profile-icon" />
        <div>
          <h2>{patient.name}</h2>
          <p className="latest-diagnosis">
            {latestDiagnosis[0]?.diagnosis || "—"} – Latest diagnosis
          </p>
        </div>
        <div className="action-buttons">
          <button className="add-button">➕ Add New</button>
        </div>
      </div>

      <div className="tab-buttons">
        <button
          className={tab === "info" ? "active" : ""}
          onClick={() => setTab("info")}
        >
          Patient Info
        </button>
        <button
          className={tab === "visits" ? "active" : ""}
          onClick={() => setTab("visits")}
        >
          Visits
        </button>
      </div>

      {tab === "info" && (
        <>
          <h3>General Information</h3>
          <div className="info-grid">
            <div><strong>Phone:</strong> {patient.phone}</div>
            <div><strong>Age:</strong> {patient.age}</div>
            <div><strong>Gender:</strong> {patient.gender}</div>
            <div><strong>Address:</strong> {patient.address}</div>
          </div>
        </>
      )}

      {tab === "visits" && (
       <div className="visit-history-section">
       <h3 className="section-title">🗓️ Visit History</h3>
       {patient.visits.length === 0 ? (
         <p>No visits recorded.</p>
       ) : (
         <div className="visit-cards">
           {patient.visits.map((visit, index) => (
             <div className="visit-card" key={index}>
               <div className="visit-date">
                 {new Date(visit.date).toLocaleDateString()}
               </div>
               <div className="visit-details">
                 <strong>{visit.diagnosis || "No Diagnosis"}</strong>
                 <p>{visit.notes || "No notes available."}</p>
               </div>
             </div>
           ))}
         </div>
       )}
     </div>
     
      )}
    </div>
  );
};

export default PatientProfile;
