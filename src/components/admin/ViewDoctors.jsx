import React, { useEffect, useState } from "react";
import LeaveModal from "./LeaveModal"; // Import the LeaveModal component
import "../../styles/ViewDoctors.css"; // ✅ Import styles

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({});
  const [selectedLeave, setSelectedLeave] = useState(null); // State for leave modal
  const [appointmentCounts, setAppointmentCounts] = useState({}); // State for appointment counts

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const token = localStorage.getItem("adminToken"); // ✅ Get token
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/doctors", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token
        },
      });
      const data = await response.json();
      console.log(data);
      setDoctors(data.doctors);

      // Fetch appointment counts for all doctors
      const counts = await Promise.all(
        data.doctors.map((doctor) => fetchAppointmentCount(doctor._id))
      );

      const appointmentCountsObj = {};
      data.doctors.forEach((doctor, index) => {
        appointmentCountsObj[doctor._id] = counts[index];
      });

      setAppointmentCounts(appointmentCountsObj);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAppointmentCount = async (doctorId) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("No token found. Please log in.");
      return 0;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/doctors/${doctorId}/completed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error("Error fetching appointment count:", error);
      return 0;
    }
  };

  const handleDeleteDoctor = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Unauthorized. Please log in.");
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/doctors/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token
        },
      });
      setDoctors(doctors.filter((doctor) => doctor._id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setUpdatedDoctor({ ...doctor }); // ✅ Ensure deep copy
  };

  const handleUpdateDoctor = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Unauthorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/doctors/update/${editingDoctor._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Include token
          },
          body: JSON.stringify(updatedDoctor),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setDoctors(
          doctors.map((doc) => (doc._id === data._id ? data : doc))
        );
        setEditingDoctor(null);
      } else {
        alert(data.message || "Failed to update doctor");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const handleViewLeave = (doctor) => {
    // Set the selected leave details and open the modal
    setSelectedLeave({ doctorId: doctor._id }); // Include doctorId in the leave object
  };

  return (
    <div className="view-doctors-section">
      <h2 className="section-title">
        <i className="bx bx-group"></i> Registered Doctors
      </h2>

      <div className="doctors-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bx bx-user-plus"></i>
          </div>
          <div className="stat-info">
            <h3>Total Doctors</h3>
            <div className="number">{doctors.length}</div>
          </div>
        </div>
      </div>

      <div className="doctors-list">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <div className="doctor-header">
                <div className="doctor-name">
                  <i className="bx bx-user-circle"></i>
                  <h3>
                    {doctor.firstName} {doctor.lastName}
                  </h3>
                </div>
                <span className="specialization-badge">
                  {doctor.specialization}
                </span>
              </div>

              <div className="doctor-details">
                <p>
                  <i className="bx bx-envelope"></i> <span>Email: {doctor.email}</span>
                </p>
                <p>
                  <i className="bx bx-phone"></i> <span>Phone: {doctor.phoneNumber}</span>
                </p>
                <p>
                  <i className="bx bx-book"></i> <span>Qualification: {doctor.qualification}</span>
                </p>
                <p>
                  <i className="bx bx-time"></i> <span>Experience: {doctor.experience} years</span>
                </p>
                <p>
                  <i className="bx bx-dollar"></i> <span>Fees: ${doctor.fees}</span>
                </p>

                <p>
                  <i className="bx bx-check-circle"></i> <span>Completed Appointments: {appointmentCounts[doctor._id] || 0}</span>
                </p>
              </div>

              <div className="doctor-actions">
                <button className="edit-btn" onClick={() => handleViewLeave(doctor)}>
                  <i className="bx bx-calendar-plus"></i> View Leave
                </button>
                <button className="edit-btn" onClick={() => handleEditDoctor(doctor)}>
                  <i className="bx bx-edit"></i> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDeleteDoctor(doctor._id)}>
                  <i className="bx bx-trash"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-doctors">
            <i className="bx bx-user-x"></i>
            <p>No doctors registered yet</p>
          </div>
        )}
      </div>

      {editingDoctor && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Edit Doctor</h2>

            <div className="modal-body">
              <label>First Name</label>
              <input
                type="text"
                value={updatedDoctor.firstName}
                onChange={(e) => setUpdatedDoctor({ ...updatedDoctor, firstName: e.target.value })}
                placeholder="Enter first name"
              />

              <label>Last Name</label>
              <input
                type="text"
                value={updatedDoctor.lastName}
                onChange={(e) => setUpdatedDoctor({ ...updatedDoctor, lastName: e.target.value })}
                placeholder="Enter last name"
              />

              <label>Email</label>
              <input
                type="email"
                value={updatedDoctor.email}
                onChange={(e) => setUpdatedDoctor({ ...updatedDoctor, email: e.target.value })}
                placeholder="Enter email"
              />

              <label>Phone Number</label>
              <input
                type="text"
                value={updatedDoctor.phoneNumber}
                onChange={(e) => setUpdatedDoctor({ ...updatedDoctor, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
              />

              <label>Qualification</label>
              <input
                type="text"
                value={updatedDoctor.qualification}
                onChange={(e) => setUpdatedDoctor({ ...updatedDoctor, qualification: e.target.value })}
                placeholder="Enter qualification"
              />

              <label>Years of Experience</label>
              <input
                type="number"
                value={updatedDoctor.experience}
                onChange={(e) => setUpdatedDoctor({ ...updatedDoctor, experience: e.target.value })}
                placeholder="Enter experience"
              />

              <label>Fees ($)</label>
              <input
                type="number"
                value={updatedDoctor.fees}
                onChange={(e) => setUpdatedDoctor({ ...updatedDoctor, fees: e.target.value })}
                placeholder="Enter fees"
              />
            </div>

            <div className="modal-footer">
              <button onClick={handleUpdateDoctor} className="btn save-btn">Update</button>
              <button onClick={() => setEditingDoctor(null)} className="btn cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedLeave && (
        <LeaveModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
          fetchDoctors={fetchDoctors}
        />
      )}
    </div>
  );
};

export default ViewDoctors;
