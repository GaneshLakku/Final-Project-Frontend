import React from 'react';

const Appointments = ({ appointments, showTodayOnly, setShowTodayOnly, handleAppointmentStatus }) => {
  const normalAppointments = appointments.filter(app => app.appointmentType === 'normal');
  const todayAppointments = normalAppointments.filter(app => {
    const appDate = new Date(app.date).toDateString();
    const today = new Date().toDateString();
    return appDate === today;
  });
  const displayedAppointments = showTodayOnly ? todayAppointments : normalAppointments;

  return (
    <div className="appointments-section">
      <h2 className="section-title">
        <i className='bx bx-calendar-check'></i> Normal Appointments
      </h2>
      <div className="stats-container">
        <div
          className={`stat-card ${!showTodayOnly ? 'active' : ''}`}
          onClick={() => setShowTodayOnly(false)}
        >
          <div className="stat-icon">
            <i className='bx bx-calendar'></i>
          </div>
          <div className="stat-info">
            <h3>Total Normal Appointments</h3>
            <div className="number">{normalAppointments.length}</div>
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
            <h3>Today's Normal Appointments</h3>
            <div className="number">{todayAppointments.length}</div>
          </div>
        </div>
      </div>
      <div className="appointments-list">
        {displayedAppointments.length > 0 ? (
          displayedAppointments.map(app => (
            <div key={app.id} className="appointment-card">
              <div className="appointment-info">
                <div className="appointment-header">
                  <span className={`status-badge ${app.status}`}>
                    {app.status}
                  </span>
                  <span className="date-badge">
                    <i className='bx bx-calendar'></i> {app.date}
                  </span>
                </div>
                <div className="patient-details">
                  <p><i className='bx bx-user'></i> Patient: {app.name}</p>
                  <p><i className='bx bx-phone'></i> Phone: {app.phoneNumber}</p>
                  <p><i className='bx bx-time'></i> Time: {app.time}</p>
                  <p><i className='bx bx-notepad'></i> Type: {app.appointmentType}</p>
                </div>
              </div>
              {app.status === 'pending' && (
                <div className="appointment-actions">
                  <button
                    className="action-btn accept-btn"
                    onClick={() => handleAppointmentStatus(app.id, 'accepted')}
                  >
                    <i className='bx bx-check'></i> Accept
                  </button>
                  <button
                    className="action-btn reject-btn"
                    onClick={() => handleAppointmentStatus(app.id, 'rejected')}
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
            <p>No {showTodayOnly ? "today's" : ''} normal appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
