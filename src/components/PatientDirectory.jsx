import React, { useEffect, useMemo, useState } from "react";
import { getPatients } from "../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ import
import axios from "axios";

const PatientDirectory = () => {
  const token = useSelector((state) => state.auth.token);
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const navigate = useNavigate(); // ✅ inside the component

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await getPatients({ page: 1, limit: 1000 }); // Load all at once
        setAllPatients(res.data.data || []);
        setPage(1); // reset to first page
      } catch (err) {
        console.error("Failed to fetch patients", err);
        alert("Error loading patient data.");
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    let filtered = [...allPatients];

    if (gender !== "All") {
      filtered = filtered.filter((p) => p.gender === gender);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const phone = p.phone?.toLowerCase() || "";
        return name.includes(term) || phone.includes(term);
      });
    }

    setFilteredPatients(filtered);
    setPage(1); // reset to page 1 when filters change
  }, [search, gender, allPatients]);

  const paginatedPatients = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredPatients.slice(start, start + limit);
  }, [filteredPatients, page]);

  const totalPages = Math.ceil(filteredPatients.length / limit);



  const handleExportPDF = async (id) => {
    try {
              const res = await fetch(`http://localhost:5001/api/visits/${id}/history.pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to download PDF: ${res.status} - ${errorText}`);
      }
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = `patient-${id}-history.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
      alert("❌ Failed to export PDF. Check console for details.");
    }
  };
  
  
  
  

  return (
    <div>
      <h3>👥 Patient Directory</h3>

      {/* Filters */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
        <input
          placeholder="Search name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.length === 0 ? (
              <tr>
                <td colSpan="6" align="center">
                  No patients found
                </td>
              </tr>
            ) : (
              paginatedPatients.map((p) => (
                <tr key={p._id}>
                  <td>
                    <span
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => navigate(`/patients/${p._id}`)} // ✅ navigate on click
                    >
                      {p.name}
                    </span>
                  </td>
                  <td>{p.phone}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>
                    {p.lastVisit
                      ? new Date(p.lastVisit).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    <button disabled={!p.lastVisit} onClick={() => handleExportPDF(p._id)}>
                      📄 Export History
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div style={{ marginTop: "16px" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          ⬅️ Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default PatientDirectory;
