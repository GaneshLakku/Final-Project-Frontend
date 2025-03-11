import React, { useState, useEffect } from "react";

const LeaveForm = () => {
  const [leaveForm, setLeaveForm] = useState({
    date: "",
    reason: "",
    status: "Pending", // Default status
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    // Retrieve doctorId from local storage
    const storedDoctorId = localStorage.getItem("doctorId");
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    } else {
      setError("Doctor ID not found in local storage.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      setError("Doctor ID is missing.");
      return;
    }

    if (!leaveForm.date || !leaveForm.reason.trim()) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/doctors/${doctorId}/request-leave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("doctorToken")}`,
          },
          body: JSON.stringify(leaveForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit leave request.");
      }

      setSuccessMessage(data.message || "Leave request submitted.");

      // Reset form after successful submission
      setLeaveForm({ date: "", reason: "", status: "Pending" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-section">
      <h2 className="section-title">
        <i className="bx bx-calendar-x"></i> Request Leave
      </h2>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="leave-form">
        <div className="form-group">
          <label>
            <i className="bx bx-calendar"></i> Leave Date
          </label>
          <input
            type="date"
            name="date"
            value={leaveForm.date}
            onChange={(e) => setLeaveForm({ ...leaveForm, date: e.target.value })}
            min={new Date().toISOString().split("T")[0]} // Restrict past dates
            required
          />
        </div>
        <div className="form-group">
          <label>
            <i className="bx bx-message-square-detail"></i> Reason
          </label>
          <textarea
            name="reason"
            value={leaveForm.reason}
            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
            placeholder="Please provide the reason for leave"
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          <i className="bx bx-send"></i> {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;
