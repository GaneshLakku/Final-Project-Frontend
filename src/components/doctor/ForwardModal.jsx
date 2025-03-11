import React, { useEffect, useState } from 'react';

const ForwardModal = ({ selectedAppointment, handleClose, onAssignSuccess, doctorData }) => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorsList = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        const data = await response.json();

        if (response.ok && Array.isArray(data.doctors)) {
          setDoctorsList(data.doctors);
        } else {
          alert("Error fetching doctors list");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorsList();
  }, []);

  const handleAssignDoctor = async (doctorId) => {
    console.log("Assigning to doctor ID:", doctorId); // Log the doctor ID being assigned
    console.log("Appointment ID:", selectedAppointment._id); // Log the appointment ID
    console.log("Current Doctor ID:", doctorData._id); // Log the current doctor ID

    try {
      const token = localStorage.getItem("doctorToken"); // Retrieve the token from localStorage

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/appointments/forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify({
          newDoctorId: doctorId,
          appointmentId: selectedAppointment._id,
          currentDoctorId: doctorData._id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Appointment forwarded successfully!");
        onAssignSuccess();
      } else {
        alert(data.message ?? "Error forwarding appointment");
      }
    } catch (error) {
      console.error("Error forwarding appointment:", error);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={handleClose} style={closeButtonStyle}>
          &times;
        </button>
        <h3>Forward Appointment</h3>
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Patient:</strong> {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}</p>
          <p><strong>Date:</strong> {selectedAppointment.date}</p>
          <p><strong>Time:</strong> {selectedAppointment.time}</p>
          <p><strong>Symptoms:</strong> {selectedAppointment.symptoms?.join(', ') || 'N/A'}</p>
        </div>
        {isLoading ? (
          <p>Loading doctors...</p>
        ) : (
          <div>
            {doctorsList.map((doctor) => (
              <div key={doctor._id} style={doctorCardStyle}>
                <p>Name: {doctor.firstName} {doctor.lastName}</p>
                <p>Specialization: {doctor.specialization}</p>
                <button
                  onClick={() => handleAssignDoctor(doctor._id)}
                  style={assignButtonStyle}
                >
                  Assign
                </button>
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

const doctorCardStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
};

const assignButtonStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#4CAF50',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default ForwardModal;
