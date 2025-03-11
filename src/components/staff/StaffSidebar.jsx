import React from 'react';

const StaffSidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className='bx bx-clinic'></i>
        <h2>Staff Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        <button
          className={activeSection === 'profile' ? 'active' : ''}
          onClick={() => setActiveSection('profile')}
        >
          <i className='bx bx-user'></i> Profile
        </button>
        <button
          className={activeSection === 'duty' ? 'active' : ''}
          onClick={() => setActiveSection('duty')}
        >
          <i className='bx bx-time-five'></i> Duty Timings
        </button>
        <button
          className={activeSection === 'appointments' ? 'active' : ''}
          onClick={() => setActiveSection('appointments')}
        >
          <i className='bx bx-calendar-check'></i> Appointments
        </button>
        <button onClick={handleLogout} className="logout-btn">
          <i className='bx bx-log-out'></i> Logout
        </button>
      </nav>
    </div>
  );
};

export default StaffSidebar;
