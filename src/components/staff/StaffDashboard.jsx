import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import StaffProfile from './StaffProfile';
import DutyTimings from './DutyTimings';
import Appointments from './StaffAppointments';
import '../../styles/StaffDashboard.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [staffData, setStaffData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  useEffect(() => {
    const staffLoggedIn = localStorage.getItem('staffLoggedIn');

    if (staffLoggedIn !== 'true') {
      navigate('/staff-login');
      return;
    }

    // Fetch staff data from localStorage
    const storedStaff = JSON.parse(localStorage.getItem('currentStaff'));
    if (!storedStaff) {
      alert('Error: Staff data not found');
      navigate('/staff-login');
      return;
    }

    setStaffData(storedStaff);
    setEditedData(storedStaff);
    setLoading(false);

    // Load appointments
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(storedAppointments);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentStaff');
    localStorage.removeItem('staffId');
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffLoggedIn');
    navigate('/staff-login');
  };

  const handleSaveProfile = () => {
    localStorage.setItem('currentStaff', JSON.stringify(editedData));
    setStaffData(editedData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleAppointmentStatus = (appointmentId, newStatus) => {
    // Update appointments in state and localStorage
    const updatedAppointments = appointments.map(app =>
      app.id === appointmentId ? { ...app, status: newStatus } : app
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Create notification for patient
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      const notificationMessage = `Your appointment scheduled for ${appointment.date} at ${appointment.time} has been ${newStatus}`;

      const newNotification = {
        id: Date.now(),
        patientId: appointment.patientId,
        message: notificationMessage,
        timestamp: new Date().toLocaleString(),
        type: 'appointment_status',
        isRead: false,
        appointmentId: appointmentId,
        status: newStatus
      };

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.unshift(newNotification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    alert(`Appointment has been ${newStatus} successfully!`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <StaffSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />
      <div className="main-content3">
        {activeSection === 'profile' && (
          <StaffProfile
            staffData={staffData}
            isEditing={isEditing}
            editedData={editedData}
            setEditedData={setEditedData}
            setIsEditing={setIsEditing}
            handleSaveProfile={handleSaveProfile}
          />
        )}
        {activeSection === 'duty' && (
          <DutyTimings staffData={staffData} />
        )}
        {activeSection === 'appointments' && (
          <Appointments
            appointments={appointments}
            showTodayOnly={showTodayOnly}
            setShowTodayOnly={setShowTodayOnly}
            handleAppointmentStatus={handleAppointmentStatus}
          />
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;