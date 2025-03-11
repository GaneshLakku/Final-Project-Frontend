import React, { useState, useEffect } from "react";

const ShiftDetailsModal = ({ selectedStaffForShift, setStaff, closeModal }) => {
  const [shiftDetails, setShiftDetails] = useState({
    startTime: "",
    endTime: "",
    startDay: "",
    endDay: "",
  });

  // Initialize shift details if in update mode
  useEffect(() => {
    if (selectedStaffForShift && selectedStaffForShift.dutyTimings && selectedStaffForShift.workDays) {
      setShiftDetails({
        startTime: selectedStaffForShift.dutyTimings.start,
        endTime: selectedStaffForShift.dutyTimings.end,
        startDay: selectedStaffForShift.workDays.startDay,
        endDay: selectedStaffForShift.workDays.endDay,
      });
    }
  }, [selectedStaffForShift]);

  const handleShiftDetails = async (isUpdate) => {
    if (!selectedStaffForShift || !selectedStaffForShift._id) {
      alert("Error: No staff member selected.");
      return;
    }

    if (!shiftDetails.startTime || !shiftDetails.endTime || !shiftDetails.startDay || !shiftDetails.endDay) {
      alert("Please fill in all shift details.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/staff/staff/${selectedStaffForShift._id}/shift`,
        {
          method: isUpdate ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shiftDetails),
        }
      );

      if (response.ok) {
        const updatedStaff = await response.json();
        setStaff((prevStaff) => {
          return prevStaff.map((staff) =>
            staff._id === updatedStaff.staff._id ? updatedStaff.staff : staff
          );
        });

        alert(isUpdate ? "Shift details updated successfully!" : "Shift details added successfully!");
        closeModal();
      } else {
        const errorData = await response.json();
        alert(`Failed to ${isUpdate ? "update" : "add"} shift details: ${errorData.message}`);
      }
    } catch (error) {
      alert(`An error occurred while ${isUpdate ? "updating" : "adding"} shift details.`);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContainer}>
        <h3 style={styles.modalTitle}>Shift Details</h3>
        <div style={styles.modalBody}>
          <input
            type="text"
            placeholder="Start Time (e.g., 09:00 AM)"
            value={shiftDetails.startTime}
            onChange={(e) => setShiftDetails({ ...shiftDetails, startTime: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="End Time (e.g., 05:00 PM)"
            value={shiftDetails.endTime}
            onChange={(e) => setShiftDetails({ ...shiftDetails, endTime: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Start Day (e.g., Monday)"
            value={shiftDetails.startDay}
            onChange={(e) => setShiftDetails({ ...shiftDetails, startDay: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="End Day (e.g., Friday)"
            value={shiftDetails.endDay}
            onChange={(e) => setShiftDetails({ ...shiftDetails, endDay: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.modalFooter}>
          <button style={{ ...styles.button, backgroundColor: "#4CAF50" }} onClick={() => handleShiftDetails(false)}>
            Add
          </button>
          <button style={{ ...styles.button, backgroundColor: "#2196F3" }} onClick={() => handleShiftDetails(true)}>
            Update
          </button>
          <button style={{ ...styles.button, backgroundColor: "#f44336" }} onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "350px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  modalTitle: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ShiftDetailsModal;
