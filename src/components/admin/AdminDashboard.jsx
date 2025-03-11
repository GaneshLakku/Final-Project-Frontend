import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Appointments from './Appointments';
import AddDoctor from './AddDoctor';
import ViewDoctors from './ViewDoctors';
import AddStaff from './AddStaff';
import ViewStaff from './ViewStaff';
import Notifications from './Notifications';
import AddMedicalShopMember from './AddMedicalShopMember';
import ViewMedicalShopMembers from './ViewMedicalShopMembers';
import '../../styles/AdminDashboard.css'; // Ensure this CSS file is imported

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [adminData, setAdminData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    experience: '',
    specialization: '',
    availableTime: '',
    username: '',
    password: ''
  });
  const [newStaff, setNewStaff] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    gender: '',
    address: '',
    shift: '',
    username: '',
    password: ''
  });
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    const adminId = localStorage.getItem('adminId');

    console.log('Admin Data from LocalStorage:', adminData);
    console.log('Admin ID from LocalStorage:', adminId);

    if (!isAdminLoggedIn || !adminData) {
      navigate('/admin-login');
      return;
    }

    setAdminData(adminData);
    setEditedData(adminData);

    // Load appointments
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const sortedAppointments = storedAppointments.sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
    setAppointments(sortedAppointments);

    // Load other data
    setDoctors(JSON.parse(localStorage.getItem('registeredDoctors') || '[]'));
    setStaff(JSON.parse(localStorage.getItem('registeredStaff') || '[]'));
    setNotifications(JSON.parse(localStorage.getItem('adminNotifications') || '[]'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminData');
    navigate('/admin-login');
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />
      <div className="main-content1">
        {activeSection === 'profile' && (
          <Profile
            adminData={adminData}
            adminId={adminData?.adminId} // Pass the admin ID safely
            isEditing={isEditing}
            editedData={editedData}
            setEditedData={setEditedData}
            setIsEditing={setIsEditing}
          />
        )}
        {activeSection === 'appointments' && (
          <Appointments
            appointments={appointments}
            showTodayOnly={showTodayOnly}
            setShowTodayOnly={setShowTodayOnly}
          />
        )}
        {activeSection === 'add-doctor' && (
          <AddDoctor
            newDoctor={newDoctor}
            setNewDoctor={setNewDoctor}
          />
        )}
        {activeSection === 'view-doctors' && (
          <ViewDoctors
            doctors={doctors}
          />
        )}
        {activeSection === 'add-staff' && (
          <AddStaff
            newStaff={newStaff}
            setNewStaff={setNewStaff}
          />
        )}
        {activeSection === 'view-staff' && (
          <ViewStaff
            staff={staff}
          />
        )}
        {activeSection === 'add-medical-shop-member' && (
          <AddMedicalShopMember />
        )}
        {activeSection === 'view-medical-shop-members' && (
          <ViewMedicalShopMembers />
        )}
        {activeSection === 'notifications' && (
          <Notifications
            notifications={notifications}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
