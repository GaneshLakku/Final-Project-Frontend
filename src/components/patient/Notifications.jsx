import React, { useEffect, useState } from 'react';

const Notifications = ({ notifications, setNotifications }) => {
  const [appointments, setAppointments] = useState([]);
  const patientId = sessionStorage.getItem('patientId');  // Retrieve patientId from session storage

  // Fetch appointments when the component mounts
  useEffect(() => {
    if (patientId) {
      fetch(`http://localhost:5000/api/appointments/patient/${patientId}/appointments`)
        .then(response => response.json())
        .then(data => {
          if (data.appointments) {
            setAppointments(data.appointments);
          } else {
            console.error("No appointments found");
          }
        })
        .catch(error => {
          console.error("Error fetching appointments:", error);
        });
    }
  }, [patientId]);  // Re-run the effect if patientId changes

  // Handle delete notification
  const handleDeleteNotification = (notificationId) => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = allNotifications.filter(notif => notif.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  return (
    <div className="notifications-section">
      <h3><i className='bx bx-bell'></i> Notifications</h3>
      {notifications.length === 0 ? (
        <p className="no-notifications">
          <i className='bx bx-message-rounded-x'></i> No notifications available
        </p>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-card ${notification.type === 'doctor_leave' && notification.isAffectedPatient ? 'urgent' : ''}`}
            >
              <div className="notification-content">
                <i className={`bx ${notification.type === 'doctor_leave' ? 'bx-calendar-x' : notification.type === 'prescription' ? 'bx-capsule' : 'bx-info-circle'}`}></i>
                <div className="notification-details">
                  <p>{notification.message}</p>
                  {notification.type === 'doctor_leave' && (
                    <div className="leave-details">
                      <span className="doctor-info">
                        <i className='bx bx-user-circle'></i>
                        Dr. {notification.doctorName} ({notification.doctorSpecialization})
                      </span>
                      <span className="leave-date">
                        <i className='bx bx-calendar'></i>
                        {notification.leaveDate}
                      </span>
                    </div>
                  )}
                  <span className="notification-time">{notification.timestamp}</span>
                </div>
              </div>
              <button
                className="delete-notification-btn"
                onClick={() => handleDeleteNotification(notification.id)}
              >
                <i className='bx bx-trash'></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Display patient's appointments */}
      {appointments.length > 0 && (
        <div className="appointments-section">
          <h3><i className="bx bx-calendar"></i> Your Appointments</h3>
          {appointments.map(appointment => (
            <div key={appointment._id} className="appointment-card">
              <p><strong>Appointment with {appointment.doctor ? appointment.doctor.name : 'Staff'}</strong></p>
              <p><strong>Status:</strong> {appointment.status}</p>
              <p><strong>Type:</strong> {appointment.type}</p>
              <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
