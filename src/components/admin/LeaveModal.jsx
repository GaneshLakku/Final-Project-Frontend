import React, { useEffect, useState } from "react";

const LeaveModal = ({ leave, onClose, fetchDoctors }) => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (leave) {
      fetchDoctorLeaves(leave.doctorId);
    }
  }, [leave]);

  const fetchDoctorLeaves = async (doctorId) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/doctors/${doctorId}/leaves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      // Filter leaves to show only pending ones
      const pendingLeaves = data.filter(leaveRequest => leaveRequest.status === "Pending");
      setLeaves(pendingLeaves);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const handleAcceptLeave = async (leaveId) => {
    const token = localStorage.getItem("adminToken");
    if (!token || !leave) {
      alert("Unauthorized or no leave selected. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/doctors/${leave.doctorId}/leaves/${leaveId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Approved" }),
        }
      );

      if (response.ok) {
        fetchDoctors(); // Fetch updated doctors data
        fetchDoctorLeaves(leave.doctorId); // Refresh the leave requests
      } else {
        const data = await response.json();
        alert(data.message || "Failed to accept leave");
      }
    } catch (error) {
      console.error("Error accepting leave:", error);
    }
  };

  const handleRejectLeave = async (leaveId) => {
    const token = localStorage.getItem("adminToken");
    if (!token || !leave) {
      alert("Unauthorized or no leave selected. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/doctors/${leave.doctorId}/leaves/${leaveId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Rejected" }),
        }
      );

      if (response.ok) {
        fetchDoctors(); // Fetch updated doctors data
        fetchDoctorLeaves(leave.doctorId); // Refresh the leave requests
      } else {
        const data = await response.json();
        alert(data.message || "Failed to reject leave");
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Leave Details</h2>
        <div className="modal-body">
          {leaves.map((leaveRequest) => (
            <div key={leaveRequest._id}>
              <p><strong>Date:</strong> {leaveRequest.date}</p>
              <p><strong>Reason:</strong> {leaveRequest.reason}</p>
              <p><strong>Status:</strong> {leaveRequest.status}</p>
              <button onClick={() => handleAcceptLeave(leaveRequest._id)} className="btn accept-btn">Accept</button>
              <button onClick={() => handleRejectLeave(leaveRequest._id)} className="btn reject-btn">Reject</button>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn cancel-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;
