import React from 'react';

const MedicalstaffSidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className='bx bx-clinic'></i>
        <h2>Medical Staff Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        <button
          className={activeSection === 'profile' ? 'active' : ''}
          onClick={() => setActiveSection('profile')}
        >
          <i className='bx bx-user'></i> Profile
        </button>
        <button
          className={activeSection === 'give-medicines' ? 'active' : ''}
          onClick={() => setActiveSection('give-medicines')}
        >
          <i className='bx bx-capsule'></i> Give Medicines
        </button>
        <button
          className={activeSection === 'past-transactions' ? 'active' : ''}
          onClick={() => setActiveSection('past-transactions')}
        >
          <i className='bx bx-history'></i> Past Transactions
        </button>
 
        <button onClick={handleLogout} className="logout-btn">
          <i className='bx bx-log-out'></i> Logout
        </button>
      </nav>
    </div>
  );
};

export default MedicalstaffSidebar;
