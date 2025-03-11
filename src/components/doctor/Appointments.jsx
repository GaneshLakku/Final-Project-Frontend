import React, { useEffect, useState } from 'react';
import PrescriptionForm from './PrescriptionForm'; // Ensure the path is correct
import ForwardModal from './ForwardModal'; // Import the new ForwardModal component

const Appointments = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);

  useEffect(() => {
    const storedDoctor = localStorage.getItem("currentDoctor");
    if (storedDoctor) {
      setDoctorData(JSON.parse(storedDoctor));
    }
  }, []);

  const fetchAllAppointmentsForDoctor = async () => {
    if (!doctorData?._id) return;

    setIsRefreshing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/doctor/${doctorData._id}/appointments`);
      if (!response.ok) {
        throw new Error(`Error fetching appointments: ${response.statusText}`);
      }
      const data = await response.json();

      if (Array.isArray(data.appointments)) {
        setAppointments(
          data.appointments.map(app => ({
            ...app,
            date: app.dateTime ? new Date(app.dateTime).toLocaleDateString() : "N/A",
            time: app.dateTime ? new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
            age: app.patient?.dateOfBirth
              ? new Date().getFullYear() - new Date(app.patient.dateOfBirth).getFullYear()
              : "N/A",
          }))
        );
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (doctorData) fetchAllAppointmentsForDoctor();
  }, [doctorData, statusFilter]);

  const updateAppointmentStatus = async (appointmentId, status) => {
    let rejectionReason = null;

    if (status === "rejected") {
      rejectionReason = prompt("Please enter a reason for rejection:");
      if (!rejectionReason) {
        alert("⚠ Rejection reason is required.");
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/appointments/doctor/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          status,
          rejectionReason,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`✅ Appointment marked as ${status}!`);
        fetchAllAppointmentsForDoctor();
      } else {
        alert(data.message ?? "⚠ Error updating appointment");
      }
    } catch (error) {
      console.error("❌ Error updating appointment status:", error);
    }
  };

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionForm(true);
  };

  const handleClosePrescriptionForm = () => {
    setShowPrescriptionForm(false);
    setSelectedAppointment(null);
  };

  const handleForwardClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForwardModal(true);
  };

  const handleAssignSuccess = () => {
    setShowForwardModal(false);
    fetchAllAppointmentsForDoctor();
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (statusFilter === "all") return true;
    if (statusFilter === "emergency") return appointment.isEmergency;
    return appointment.status === statusFilter;
  });

  return (
    <div className="appointments-section">
      <div className="section-header">
        <h2 className="section-title">
          <i className="bx bx-calendar"></i> Doctor's Appointments
        </h2>
        <button
          className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={fetchAllAppointmentsForDoctor}
          disabled={isRefreshing}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          <i className="bx bx-refresh"></i> Refresh
        </button>
      </div>

      <div className="filter-container" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      <div className="appointments-container">
        {filteredAppointments.length === 0 ? (
          <p className="no-appointments">
            <i className="bx bx-alarm-exclamation"></i> No appointments found
          </p>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment._id} className={`appointment-card ${appointment.status}`}>
              <div className="appointment-header">
                <div className="header-left">
                  <span className="date"><i className="bx bx-calendar"></i> {appointment.date}</span>
                  <span className="time"><i className="bx bx-time"></i> {appointment.time}</span>
                </div>
                <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
                {appointment.isEmergency && <span className="emergency-badge">Emergency</span>}
                <button
                  className="forward-btn"
                  onClick={() => handleForwardClick(appointment)}
                  disabled={appointment.status === "pending" || appointment.status === "rejected"}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f0f0f0',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginLeft: '10px',
                    color: appointment.status === "pending" || appointment.status === "rejected" ? 'gray' : 'black',
                  }}
                >
                  <i className="bx bx-skip-next"></i> Forward
                </button>
              </div>
              <div className="patient-details">
                <p><i className="bx bx-user"></i> Patient: {appointment.patient?.firstName} {appointment.patient?.lastName}</p>
                <p><i className="bx bx-calendar"></i> Age: {appointment.age} years</p>
                <p><i className="bx bx-phone"></i> Contact: {appointment.patient?.phoneNumber}</p>
                <p><i className="bx bx-virus"></i> Symptoms: {appointment.symptoms?.join(', ') || 'N/A'}</p>
                <p><i className="bx bx-id-card"></i> Patient ID: {appointment.patient?._id}</p>
                <p><i className="bx bx-id-card"></i> Appointment ID: {appointment._id}</p>
                <p><i className="bx bx-id-card"></i> Doctor ID: {doctorData?._id}</p>
              </div>

              <div className="action-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                {appointment.status === "pending" && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, "accepted")}
                    className="accept-btn"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Accept
                  </button>
                )}

                {appointment.status === "accepted" && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, "confirmed")}
                    className="confirm-btn"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Confirm
                  </button>
                )}

                {appointment.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => updateAppointmentStatus(appointment._id, "completed")}
                      className="complete-btn"
                      style={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#FF9800',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleAddPrescription(appointment)}
                      className="prescription-btn"
                      style={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#8BC34A',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Add Prescription
                    </button>
                  </>
                )}

                {appointment.status !== "rejected" && appointment.status !== "completed" && appointment.status !== "confirmed" && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, "rejected")}
                    className="reject-btn"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#F44336',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showPrescriptionForm && (
        <PrescriptionForm
          selectedAppointment={selectedAppointment}
          doctorData={doctorData}
          handleClosePrescriptionForm={handleClosePrescriptionForm}
          updateAppointmentStatus={updateAppointmentStatus}
        />
      )}

      {showForwardModal && (
        <ForwardModal
          selectedAppointment={selectedAppointment}
          handleClose={() => setShowForwardModal(false)}
          onAssignSuccess={handleAssignSuccess}
          doctorData={doctorData} // Pass the doctorData prop
        />
      )}
    </div>
  );
};

export default Appointments;
