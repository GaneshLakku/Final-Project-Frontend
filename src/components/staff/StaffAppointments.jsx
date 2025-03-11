import React, { useState, useEffect } from 'react';

// Helper function to calculate age
const calculateAge = (dob) => {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const StaffAppointments = ({ showTodayOnly, setShowTodayOnly }) => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // Default to "all"

  // Fetching appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments/staff/pending');
        const data = await response.json();

        if (response.ok && data.appointments) {
          setAppointments(data.appointments);
        } else {
          alert(data.message || 'Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Function to update appointment status
  const handleAppointmentStatus = async (appointmentId, status) => {
    let reason = "";
    if (status === "rejected") {
      reason = prompt("Please provide a reason for rejection:");
      if (!reason) {
        alert("Rejection reason is required.");
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/appointments/staff/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId, status, reason }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update UI to reflect the change
        setAppointments(prevAppointments =>
          prevAppointments.map(app =>
            app._id === appointmentId ? { ...app, status, rejectionReason: reason } : app
          )
        );
        alert(`Appointment ${status} successfully!`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert("Failed to update appointment status.");
    }
  };

  // Filter appointments based on date and status
  const todayAppointments = appointments.filter(app => {
    const appDate = new Date(app.dateTime).toDateString();
    const today = new Date().toDateString();
    return appDate === today;
  });

  const filteredAppointments = appointments.filter(app =>
    statusFilter === "all" ? true : app.status === statusFilter
  );

  const displayedAppointments = showTodayOnly ? todayAppointments : filteredAppointments;

  return (
    <div className="appointments-section">
      <h2 className="section-title">
        <i className='bx bx-calendar-check'></i> Appointments
      </h2>
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
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="stats-container">
        <div
          className={`stat-card ${!showTodayOnly ? 'active' : ''}`}
          onClick={() => setShowTodayOnly(false)}
        >
          <div className="stat-icon">
            <i className='bx bx-calendar'></i>
          </div>
          <div className="stat-info">
            <h3>Total Appointments</h3>
            <div className="number">{appointments.length}</div>
          </div>
        </div>
        <div
          className={`stat-card ${showTodayOnly ? 'active' : ''}`}
          onClick={() => setShowTodayOnly(true)}
        >
          <div className="stat-icon">
            <i className='bx bx-calendar-event'></i>
          </div>
          <div className="stat-info">
            <h3>Today's Appointments</h3>
            <div className="number">{todayAppointments.length}</div>
          </div>
        </div>
      </div>
      <div className="appointments-list">
        {displayedAppointments.length > 0 ? (
          displayedAppointments.map(app => (
            <div key={app._id} className="appointment-card">
              <div className="appointment-info">
                <div className="appointment-header">
                  <span className={`status-badge ${app.status}`}>
                    {app.status}
                  </span>
                  <span className="date-badge">
                    <i className='bx bx-calendar'></i> {new Date(app.dateTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="patient-details">
                  <p>
                    <i className='bx bx-user'></i>
                    Patient: {app.patient ? `${app.patient.firstName} ${app.patient.lastName}` : "Unknown"}
                  </p>
                  <p>
                    <i className='bx bx-phone'></i>
                    Phone: {app.patient?.phoneNumber || "N/A"}
                  </p>
                  <p>
                    <i className='bx bx-calendar'></i>
                    Age: {calculateAge(app.patient?.dateOfBirth)}
                  </p>
                  <p>
                    <i className='bx bx-time'></i>
                    Time: {new Date(app.dateTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              {app.status === 'pending' && (
                <div className="appointment-actions">
                  <button
                    className="action-btn accept-btn"
                    onClick={() => handleAppointmentStatus(app._id, 'accepted')}
                  >
                    <i className='bx bx-check'></i> Accept
                  </button>
                  <button
                    className="action-btn reject-btn"
                    onClick={() => handleAppointmentStatus(app._id, 'rejected')}
                  >
                    <i className='bx bx-x'></i> Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-appointments">
            <i className='bx bx-calendar-x'></i>
            <p>No {showTodayOnly ? "today's" : ''} appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAppointments;
