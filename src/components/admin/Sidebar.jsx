import React from 'react';

const Sidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className='bx bx-clinic'></i>
        <h2>Admin Dashboard</h2>
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
        <button
          className={activeSection === 'add-doctor' ? 'active' : ''}
          onClick={() => setActiveSection('add-doctor')}
        >
          <i className='bx bx-plus-medical'></i> Add Doctor
        </button>
        <button
          className={activeSection === 'view-doctors' ? 'active' : ''}
          onClick={() => setActiveSection('view-doctors')}
        >
          <i className='bx bx-group'></i> View Doctors
        </button>
        <button
          className={activeSection === 'add-staff' ? 'active' : ''}
          onClick={() => setActiveSection('add-staff')}
        >
          <i className='bx bx-user-plus'></i> Add Staff
        </button>
        <button
          className={activeSection === 'view-staff' ? 'active' : ''}
          onClick={() => setActiveSection('view-staff')}
        >
          <i className='bx bx-user-check'></i> View Staff
        </button>
        <button
          className={activeSection === 'add-medical-shop-member' ? 'active' : ''}
          onClick={() => setActiveSection('add-medical-shop-member')}
        >
          <i className='bx bx-user-plus'></i> Add Medical Shop Member
        </button>
        <button
          className={activeSection === 'view-medical-shop-members' ? 'active' : ''}
          onClick={() => setActiveSection('view-medical-shop-members')}
        >
          <i className='bx bx-user-check'></i> View Medical Shop Members
        </button>
        <button
          className={activeSection === 'notifications' ? 'active' : ''}
          onClick={() => setActiveSection('notifications')}
        >
          <i className='bx bx-bell'></i> Notifications
        </button>
        <button onClick={handleLogout} className="logout-btn">
          <i className='bx bx-log-out'></i> Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
