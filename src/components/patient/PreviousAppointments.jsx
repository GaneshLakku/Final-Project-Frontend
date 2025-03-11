import React, { useState, useEffect } from 'react';

const PreviousAppointments = ({ patientData, setNotifications }) => {
  const [completedAppointments, setCompletedAppointments] = useState([]);

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      try {
        const patientId = sessionStorage.getItem('patientId'); // Assuming patientId is stored in session storage
        const response = await fetch(`http://localhost:5000/api/appointments/patient/${patientId}/appointments/completed`);

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setCompletedAppointments(data.appointments); // Assuming the API returns appointments in 'appointments' field
        } else {
          alert("Failed to fetch completed appointments.");
        }
      } catch (error) {
        console.error('Error fetching completed appointments:', error);
      }
    };

    fetchCompletedAppointments();
  }, []); // Fetch when the component is mounted

  const handleCancelAppointment = (appointmentId) => {
    console.log('Cancelling appointment ID:', appointmentId);
    // Handle cancel appointment logic
    alert('Appointment cancelled successfully!');
  };

  const handleDeleteAppointment = async (appointmentId) => {
    console.log('Deleting appointment ID:', appointmentId);
    const patientId = sessionStorage.getItem('patientId');
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/appointments/patient/${patientId}/appointment/${appointmentId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert('Appointment record deleted successfully!');
        setCompletedAppointments(prevAppointments =>
          prevAppointments.filter(app => app._id !== appointmentId)
        );
      } else {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          alert(`Failed to delete appointment: ${errorData.message}`);
        } else {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          alert('Failed to delete appointment. Please check the console for more details.');
        }
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('An error occurred while deleting the appointment.');
    }
  };

  return (
    <div className="previous-appointments">
      <h3><i className='bx bx-history'></i> Previous Appointments</h3>
      {completedAppointments.length === 0 ? (
        <p className="no-appointments">
          <i className='bx bx-calendar-x'></i> No completed appointments available
        </p>
      ) : (
        <div className="appointments-list">
          {completedAppointments.map(app => {
            console.log('Appointment ID:', app._id); // Log the appointment ID
            return (
              <div
                key={app._id}
                className={`appointment-card ${app.status}`}
              >
                <div className="appointment-header">
                  <span className={`status-badge ${app.status}`}>{app.status}</span>
                  <span className={`type-badge ${app.type}`}>
                    {app.type}
                  </span>
                </div>
                <div className="appointment-details">
                  <p><i className='bx bx-calendar'></i> Date: {new Date(app.dateTime).toLocaleDateString()}</p>
                  <p><i className='bx bx-time'></i> Time: {new Date(app.dateTime).toLocaleTimeString()}</p>
                  <p><i className='bx bx-user'></i> Name: {app.patient.name}</p>
                </div>
                <div className="appointment-actions">
                  {app.status !== 'completed' && (
                    <button
                      className="cancel-appointment-btn"
                      onClick={() => handleCancelAppointment(app._id)}
                    >
                      <i className='bx bx-x'></i> Cancel Appointment
                    </button>
                  )}
                  {app.status === 'completed' && (
                    <button
                      className="delete-appointment-btn"
                      onClick={() => handleDeleteAppointment(app._id)}
                    >
                      <i className='bx bx-trash'></i> Delete Record
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PreviousAppointments;
