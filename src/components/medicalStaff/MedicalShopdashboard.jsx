import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicalstaffSidebar from './MedicalstaffSidebar';
import MedicalstaffProfile from './MedicalstaffProfile';
import GiveMedicines from './GiveMedicines';
import PastTransactions from './PastTransactions';


const MedicalShopdashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [staffData, setStaffData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const staffLoggedIn = localStorage.getItem('medicalShopMemberLoggedIn');

    if (staffLoggedIn !== 'true') {
      navigate('/medicalshop-login');
      return;
    }

    const storedStaff = localStorage.getItem('currentMedicalShopMember');
    if (!storedStaff) {
      alert('Error: Staff data not found');
      navigate('/medicalshop-login');
      return;
    }

    try {
      const parsedStaff = JSON.parse(storedStaff);
      setStaffData(parsedStaff);
      setEditedData(parsedStaff);
    } catch (error) {
      console.error("Error parsing staff data:", error);
      alert('Error: Invalid staff data');
      navigate('/medicalshop-login');
      return;
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentMedicalShopMember');
    localStorage.removeItem('medicalShopMemberToken');
    localStorage.removeItem('medicalShopMemberLoggedIn');
    navigate('/medicalshop-login');
  };

  const handleSaveProfile = () => {
    localStorage.setItem('currentMedicalShopMember', JSON.stringify(editedData));
    setStaffData(editedData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '20px', boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)' }}>
        <MedicalstaffSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleLogout={handleLogout}
        />
      </div>
      <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
        {activeSection === 'profile' && (
          <MedicalstaffProfile
            staffData={staffData}
            isEditing={isEditing}
            editedData={editedData}
            setEditedData={setEditedData}
            setIsEditing={setIsEditing}
            handleSaveProfile={handleSaveProfile}
          />
        )}
        {activeSection === 'give-medicines' && <GiveMedicines staffData={staffData} />}
        {activeSection === 'past-transactions' && <PastTransactions staffData={staffData} />}
     
      </div>
    </div>
  );
};

export default MedicalShopdashboard;
