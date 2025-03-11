import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorProfile from './DoctorProfile';
import Appointments from './Appointments';
import NormalAppointments from './NormalAppointments';
import ForwardedAppointments from './ForwardedAppointments'; // Import the new ForwardedAppointments component
import LeaveForm from './LeaveForm';
import '../../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [doctorData, setDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [normalAppointments, setNormalAppointments] = useState([]);
  const [emergencyAppointments, setEmergencyAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [leaveForm, setLeaveForm] = useState({ date: '', reason: '' });
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('doctorLoggedIn');
    const storedDoctorData = localStorage.getItem('currentDoctor');

    if (!isLoggedIn || !storedDoctorData) {
      navigate('/doctor-login');
      return;
    }

    const parsedDoctorData = JSON.parse(storedDoctorData);
    setDoctorData(parsedDoctorData);
    setEditedData(parsedDoctorData);
  }, [navigate]);

  useEffect(() => {
    if (doctorData) {
      loadAppointments();
      const doctors = JSON.parse(localStorage.getItem('registeredDoctors') || '[]');
      setAvailableDoctors(doctors.filter(doc => doc.username !== doctorData.username));
    }
  }, [doctorData]);

  const loadAppointments = () => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    if (!doctorData) return;

    if (doctorData.specialization === 'General Doctor') {
      setAppointments(allAppointments.filter(app => app.status === 'accepted' && app.appointmentType === 'normal' && !app.forwardedTo));
      setEmergencyAppointments(allAppointments.filter(app => app.appointmentType === 'emergency' && !app.forwardedTo));
    } else {
      setAppointments(allAppointments.filter(app => app.forwardedTo === doctorData.specialization && app.status === 'forwarded'));
      setEmergencyAppointments([]);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'appointments') {
        loadAppointments();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [doctorData]);

  const handleSaveProfile = () => {
    const doctors = JSON.parse(localStorage.getItem('registeredDoctors') || '[]');
    const updatedDoctors = doctors.map(doc => (doc.username === doctorData.username ? editedData : doc));
    localStorage.setItem('registeredDoctors', JSON.stringify(updatedDoctors));
    localStorage.setItem('currentDoctor', JSON.stringify(editedData));
    setDoctorData(editedData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentDoctor');
    localStorage.removeItem('doctorLoggedIn');
    navigate('/doctor-login');
  };

  const handleRefreshAppointments = () => {
    setIsRefreshing(true);
    loadAppointments();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="dashboard-container">
      {doctorData ? (
        <>
          <DoctorSidebar activeSection={activeSection} setActiveSection={setActiveSection} handleLogout={handleLogout} />
          <div className="main-content2">
            {activeSection === 'profile' && (
              <DoctorProfile
                doctorData={doctorData}
                isEditing={isEditing}
                editedData={editedData}
                setEditedData={setEditedData}
                setIsEditing={setIsEditing}
                handleSaveProfile={handleSaveProfile}
              />
            )}
            {activeSection === 'appointments' && (
              <Appointments
                appointments={appointments}
                emergencyAppointments={emergencyAppointments}
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
                doctorData={doctorData}
                handleRefreshAppointments={handleRefreshAppointments}
                isRefreshing={isRefreshing}
              />
            )}
            {activeSection === 'normalAppointments' && (
              <NormalAppointments
                normalAppointments={normalAppointments}
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
                doctorData={doctorData}
                handleRefreshAppointments={handleRefreshAppointments}
                isRefreshing={isRefreshing}
              />
            )}
            {activeSection === 'forwardedAppointments' && (
              <ForwardedAppointments
                doctorData={doctorData}
                handleRefreshAppointments={handleRefreshAppointments}
                isRefreshing={isRefreshing}
              />
            )}
            {activeSection === 'leave' && (
              <LeaveForm leaveForm={leaveForm} setLeaveForm={setLeaveForm} />
            )}
          </div>
        </>
      ) : (
        <p>Loading doctor data...</p>
      )}
    </div>
  );
};

export default DoctorDashboard;
