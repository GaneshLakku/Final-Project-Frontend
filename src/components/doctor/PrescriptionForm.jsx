import React, { useState } from "react";

const PrescriptionForm = ({ selectedAppointment, doctorData, handleClosePrescriptionForm, updateAppointmentStatus }) => {
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [oldPrescriptions, setOldPrescriptions] = useState([]);
  const [showOldPrescriptions, setShowOldPrescriptions] = useState(false);

  const addOrUpdateMedicine = () => {
    if (!medicineName || !dosage || !duration) {
      alert("⚠ Please enter medicine name, dosage, and duration!");
      return;
    }

    const newMedicine = { name: medicineName, dosage, duration };

    if (editingIndex !== null) {
      const updatedMedicines = [...medicines];
      updatedMedicines[editingIndex] = newMedicine;
      setMedicines(updatedMedicines);
      setEditingIndex(null);
    } else {
      setMedicines([...medicines, newMedicine]);
    }

    setMedicineName("");
    setDosage("");
    setDuration("");
  };

  const deleteMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const editMedicine = (index) => {
    setMedicineName(medicines[index].name);
    setDosage(medicines[index].dosage);
    setDuration(medicines[index].duration);
    setEditingIndex(index);
  };

  const submitPrescription = async () => {
    if (medicines.length === 0) {
      alert("⚠ Please add at least one medicine.");
      return;
    }

    const prescriptionData = {
      appointmentId: selectedAppointment?._id,
      doctorId: doctorData?._id,
      medicines,
      notes,
    };

    try {
      const response = await fetch("http://localhost:5000/api/appointments/prescriptions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("doctorToken"),
        },
        body: JSON.stringify(prescriptionData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Prescription submitted successfully!");
        setMedicines([]);
        setNotes("");
        handleClosePrescriptionForm();
        await updateAppointmentStatus(selectedAppointment?._id, "completed");
      } else {
        alert(data.message || "⚠ Error submitting prescription.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("⚠ Network error.");
    }
  };

  const fetchOldPrescriptions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/prescriptions/patient/${selectedAppointment?.patient?._id}/doctor/${doctorData?._id}`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("doctorToken"),
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOldPrescriptions(data.prescriptions);
        setShowOldPrescriptions(true);
      } else {
        alert(data.message || "⚠ Error fetching old prescriptions.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("⚠ Network error.");
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={handleClosePrescriptionForm} style={closeButtonStyle}>
          &times;
        </button>
        <h2>Doctor Prescription Form</h2>
        <div>
          <p><strong>Patient:</strong> {selectedAppointment?.patient?.firstName} {selectedAppointment?.patient?.lastName}</p>
          <p><strong>Date:</strong> {selectedAppointment?.date}</p>
          <p><strong>Time:</strong> {selectedAppointment?.time}</p>
        </div>
        <h3>Prescription</h3>
        <input type="text" placeholder="Medicine Name" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Dosage (e.g., 500mg)" value={dosage} onChange={(e) => setDosage(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Duration (e.g., 7 days)" value={duration} onChange={(e) => setDuration(e.target.value)} style={inputStyle} />
        <button onClick={addOrUpdateMedicine} style={buttonStyle}>{editingIndex !== null ? "✏ Update Medicine" : "➕ Add Medicine"}</button>

        <div style={{ marginTop: 10 }}>
          {medicines.map((med, index) => (
            <div key={index} style={medicineCardStyle}>
              <span>{med.name} - {med.dosage} for {med.duration}</span>
              <div>
                <button onClick={() => editMedicine(index)} style={editButtonStyle}>✏</button>
                <button onClick={() => deleteMedicine(index)} style={deleteButtonStyle}>❌</button>
              </div>
            </div>
          ))}
        </div>

        <textarea placeholder="Additional Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={textareaStyle}></textarea>
        <button onClick={submitPrescription} style={submitButtonStyle}>✅ Submit Prescription</button>

        <button onClick={fetchOldPrescriptions} style={{ ...buttonStyle, marginTop: 10 }}>📜 View Old Prescriptions</button>

        {showOldPrescriptions && oldPrescriptions.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Old Prescriptions</h3>
            {oldPrescriptions.map((prescription, index) => (
              <div key={index} style={medicineCardStyle}>
                <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
                <p><strong>Medicines:</strong></p>
                <ul>
                  {prescription.medicines.map((med, medIndex) => (
                    <li key={medIndex}>{med.name} - {med.dosage} for {med.duration}</li>
                  ))}
                </ul>
                <p><strong>Notes:</strong> {prescription.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '50%',
  maxWidth: '600px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

const closeButtonStyle = {
  float: 'right',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 5,
};

const buttonStyle = {
  width: "100%",
  padding: 8,
  marginTop: 5,
};

const medicineCardStyle = {
  background: "#ddd",
  padding: 5,
  marginTop: 5,
  borderRadius: 5,
  display: "flex",
  justifyContent: "space-between",
};

const editButtonStyle = {
  marginRight: 5,
};

const deleteButtonStyle = {
  cursor: 'pointer',
};

const textareaStyle = {
  width: "100%",
  padding: 8,
  marginTop: 10,
};

const submitButtonStyle = {
  width: "100%",
  padding: 8,
  marginTop: 10,
};

export default PrescriptionForm;
