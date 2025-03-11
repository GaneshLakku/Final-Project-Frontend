import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSection from './ProfileSection';
import AppointmentForm from './AppointmentForm';
import PreviousAppointments from './PreviousAppointments';
import Prescriptions from './Prescriptions';
import Notifications from './Notifications';
import '../../styles/PatientDashboard.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [patientData, setPatientData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const patientId = sessionStorage.getItem('patientId');

    if (!token || !patientId) {
      navigate('/patient-login');
      return;
    }

    const fetchPatientDetails = async () => {
      try {
        console.log('Fetching patient details...');
        const response = await fetch(`http://localhost:5000/api/patients/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch patient details: ${await response.text()}`);
        }

        const data = await response.json();
        console.log('Fetched patient data:', data);
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient details:', error.message);
      }
    };

    fetchPatientDetails();
  }, [navigate]);

 

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/patient-login');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <i className='bx bx-clinic'></i>
          <h2>Patient Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <button className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>
            <i className='bx bx-user'></i> Profile
          </button>
          <button className={activeSection === 'appointment' ? 'active' : ''} onClick={() => setActiveSection('appointment')}>
            <i className='bx bx-calendar-plus'></i> Make Appointment
          </button>
          <button className={activeSection === 'previous' ? 'active' : ''} onClick={() => setActiveSection('previous')}>
            <i className='bx bx-history'></i> Previous Appointments
          </button>
          <button className={activeSection === 'prescriptions' ? 'active' : ''} onClick={() => setActiveSection('prescriptions')}>
            <i className='bx bx-file'></i> Prescriptions
          </button>
          <button className={activeSection === 'notifications' ? 'active' : ''} onClick={() => setActiveSection('notifications')}>
            <i className='bx bx-bell'></i> Notifications
            {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <i className='bx bx-log-out'></i> Logout
          </button>
        </nav>
      </div>
      <div className="main-content1">
        {activeSection === 'profile' && <ProfileSection patientData={patientData} setPatientData={setPatientData} />}
        {activeSection === 'appointment' && <AppointmentForm patientData={patientData} />}
        {activeSection === 'previous' && <PreviousAppointments patientData={patientData} />}
        {activeSection === 'prescriptions' && <Prescriptions patientData={patientData} />}
        {activeSection === 'notifications' && <Notifications notifications={notifications} />}
      </div>
    </div>
  );
};

export default PatientDashboard;
