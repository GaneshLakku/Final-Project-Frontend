import React, { useState, useEffect } from "react";
import "../../styles/ViewDoctors.css";
import ShiftDetailsModal from "./ShiftDetailsModa"; // Import the modal component

const ViewStaff = () => {
  const [staff, setStaff] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [updatedStaff, setUpdatedStaff] = useState({});
  const [selectedStaffForShift, setSelectedStaffForShift] = useState(null);
  const [showShiftModal, setShowShiftModal] = useState(false); // State for modal visibility

  // ✅ Fetch all staff members from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/staff")
      .then((res) => res.json())
      .then((data) => {
        if (data.staff) {
          console.log(data.staff);
          setStaff(data.staff);
        }
      })
      .catch((error) => console.error("Error fetching staff:", error));
  }, []);

  // ✅ Handle delete staff
  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`http://localhost:5000/api/staff/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setStaff((prevStaff) => prevStaff.filter((member) => member._id !== id));
        } else {
          const errorData = await response.json();
          console.error("Delete failed:", errorData.message);
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  // ✅ Handle update staff
  const handleUpdateStaff = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/staff/update/${editingStaff._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedStaff),
      });

      if (response.ok) {
        const updated = await response.json();
        setStaff(staff.map((member) => (member._id === updated.staff._id ? updated.staff : member)));
        setEditingStaff(null);
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  return (
    <div className="view-staff-section">
      <h2 className="section-title">
        <i className="bx bx-group"></i> Registered Staff
      </h2>
      <div className="staff-list">
        {staff.length > 0 ? (
          staff.map((staffMember) => (
            <div key={staffMember._id} className="staff-card">
              <div className="staff-header">
                <h3>
                  {staffMember.firstName} {staffMember.lastName}
                </h3>
                <span className="shift-badge">{staffMember.position}</span>
              </div>
              <div className="staff-details">
                <p><i className="bx bx-envelope"></i> {staffMember.email}</p>
                <p><i className="bx bx-phone"></i> {staffMember.phoneNumber}</p>
                <p><i className="bx bx-briefcase"></i> {staffMember.position}</p>
                <p><i className="bx bx-building"></i> {staffMember.department}</p>
              </div>

              <div className="doctor-actions">
                <button className="edit-btn" onClick={() => {
                  setEditingStaff(staffMember);
                  setUpdatedStaff(staffMember);
                }}>
                  <i className="bx bx-edit"></i> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDeleteStaff(staffMember._id)}>
                  <i className="bx bx-trash"></i> Remove
                </button>
                <button className="shift-btn" onClick={() => {
                  setSelectedStaffForShift(staffMember);
                  setShowShiftModal(true); // Show the modal
                }}>
                  <i className="bx bx-time"></i> Add Shift Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-staff">
            <i className="bx bx-user-x"></i>
            <p>No staff registered yet</p>
          </div>
        )}
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">Edit Staff</h3>
            <div className="modal-body">
              <input type="text" value={updatedStaff.firstName} onChange={(e) => setUpdatedStaff({ ...updatedStaff, firstName: e.target.value })} placeholder="First Name" />
              <input type="text" value={updatedStaff.lastName} onChange={(e) => setUpdatedStaff({ ...updatedStaff, lastName: e.target.value })} placeholder="Last Name" />
              <input type="email" value={updatedStaff.email} onChange={(e) => setUpdatedStaff({ ...updatedStaff, email: e.target.value })} placeholder="Email" />
            </div>
            <div className="modal-footer">
              <button className="btn save-btn" onClick={handleUpdateStaff}>Update</button>
              <button className="btn cancel-btn" onClick={() => setEditingStaff(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Shift Details Modal */}
      {showShiftModal && (
        <ShiftDetailsModal
          selectedStaffForShift={selectedStaffForShift}
          setStaff={setStaff}
          closeModal={() => setShowShiftModal(false)}
        />
      )}
    </div>
  );
};

export default ViewStaff;
