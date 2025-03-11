import React, { useState, useEffect } from "react";
import "../../styles/ViewDoctors.css";

const ViewMedicalShopMembers = () => {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [updatedMember, setUpdatedMember] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchMedicalShopMembers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/medical-shop/members", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMembers(data.members);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch medical shop members." });
    }
  };

  useEffect(() => {
    fetchMedicalShopMembers();
  }, []);

  const handleDeleteMember = async (id) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`http://localhost:5000/api/medical-shop/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setMembers((prevMembers) => prevMembers.filter((member) => member._id !== id));
          setMessage({ type: "success", text: "Member removed successfully." });
        } else {
          const errorData = await response.json();
          setMessage({ type: "error", text: errorData.message });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Error deleting member." });
      }
    }
  };

  const handleUpdateMember = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/medical-shop/update/${editingMember._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedMember),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setMembers((prevMembers) =>
          prevMembers.map((member) => (member._id === updatedData.member._id ? updatedData.member : member))
        );
        setEditingMember(null);
        setMessage({ type: "success", text: "Member updated successfully." });
      } else {
        const errorData = await response.json();
        setMessage({ type: "error", text: errorData.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error updating member." });
    }
    setLoading(false);
  };

  return (
    <div className="view-staff-section">
      <h2 className="section-title">
        <i className="bx bx-group"></i> Registered Medical Shop Members
      </h2>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}

      <div className="staff-list">
        {members.length > 0 ? (
          members.map((member) => (
            <div key={member._id} className="staff-card">
              <div className="staff-header">
                <h3>
                  {member.firstName} {member.lastName}
                </h3>
                <span className="shift-badge">Shop ID: {member.shopId}</span>
              </div>
              <div className="staff-details">
                <p>
                  <i className="bx bx-envelope"></i> {member.email}
                </p>
                <p>
                  <i className="bx bx-phone"></i> {member.phoneNumber}
                </p>
                <p>
                  <i className="bx bx-store"></i> Shop ID: {member.shopId}
                </p>
              </div>

              <div className="doctor-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingMember(member);
                    setUpdatedMember(member);
                  }}
                >
                  <i className="bx bx-edit"></i> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDeleteMember(member._id)}>
                  <i className="bx bx-trash"></i> Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-staff">
            <i className="bx bx-user-x"></i>
            <p>No medical shop members registered yet</p>
          </div>
        )}
      </div>

      {editingMember && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">Edit Member</h3>
            <div className="modal-body">
              <input
                type="text"
                value={updatedMember.firstName}
                onChange={(e) => setUpdatedMember({ ...updatedMember, firstName: e.target.value })}
                placeholder="First Name"
              />
              <input
                type="text"
                value={updatedMember.lastName}
                onChange={(e) => setUpdatedMember({ ...updatedMember, lastName: e.target.value })}
                placeholder="Last Name"
              />
              <input
                type="email"
                value={updatedMember.email}
                onChange={(e) => setUpdatedMember({ ...updatedMember, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                value={updatedMember.phoneNumber}
                onChange={(e) => setUpdatedMember({ ...updatedMember, phoneNumber: e.target.value })}
                placeholder="Phone Number"
              />
              <input
                type="text"
                value={updatedMember.shopId}
                onChange={(e) => setUpdatedMember({ ...updatedMember, shopId: e.target.value })}
                placeholder="Shop ID"
              />
            </div>
            <div className="modal-footer">
              <button className="btn save-btn" onClick={handleUpdateMember} disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>
              <button className="btn cancel-btn" onClick={() => setEditingMember(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMedicalShopMembers;
