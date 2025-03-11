import React from 'react';

const DoctorSidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className='bx bx-clinic'></i>
        <h2>Doctor Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        <button
          className={activeSection === 'profile' ? 'active' : ''}
          onClick={() => setActiveSection('profile')}
        >
          <i className='bx bx-user'></i> Profile
        </button>

        <button
          className={activeSection === 'appointments' ? 'active' : ''}
          onClick={() => setActiveSection('appointments')}
        >
          <i className='bx bx-calendar'></i> View Appointments
        </button>

        {/* 🔹 New "Normal Appointments" Button */}
        <button
          className={activeSection === 'normalAppointments' ? 'active' : ''}
          onClick={() => setActiveSection('normalAppointments')}
        >
          <i className='bx bx-list-ul'></i> Normal Appointments
        </button>

        {/* 🔹 New "Forwarded Appointments" Button */}
        <button
          className={activeSection === 'forwardedAppointments' ? 'active' : ''}
          onClick={() => setActiveSection('forwardedAppointments')}
        >
          <i className='bx bx-transfer'></i> Forwarded Appointments
        </button>

        <button
          className={activeSection === 'leave' ? 'active' : ''}
          onClick={() => setActiveSection('leave')}
        >
          <i className='bx bx-time-five'></i> Doctor Leave
        </button>

        <button onClick={handleLogout} className="logout-btn">
          <i className='bx bx-log-out'></i> Logout
        </button>
      </nav>
    </div>
  );
};

export default DoctorSidebar;
