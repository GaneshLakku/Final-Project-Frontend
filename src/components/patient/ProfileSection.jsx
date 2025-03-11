import React, { useState, useEffect } from 'react';

const ProfileSection = ({ patientData, setPatientData, token }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(patientData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patientData) {
      setEditedData(patientData);
    }
  }, [patientData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Retrieve token again to ensure it's valid
      const storedToken = sessionStorage.getItem('token');
      if (!storedToken) {
        alert("Unauthorized! Please log in again.");
        return;
      }
  
      const updatedProfile = { ...editedData };
  
      const response = await fetch(`http://localhost:5000/api/patients/${patientData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`, // Ensure proper formatting
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
  
      const data = await response.json();
      setPatientData(data.updatedPatient);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating patient details:', error.message);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="profile-section">
      <h3>Patient Profile</h3>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedData?.firstName || ''}
            onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
            placeholder="First Name"
          />
          <input
            type="text"
            value={editedData?.lastName || ''}
            onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
            placeholder="Last Name"
          />
          <input
            type="date"
            value={formatDate(editedData?.dateOfBirth)}
            onChange={(e) => setEditedData({ ...editedData, dateOfBirth: e.target.value })}
            placeholder="Date of Birth"
          />
          <select
            value={editedData?.gender || ''}
            onChange={(e) => setEditedData({ ...editedData, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            value={editedData?.bloodGroup || ''}
            onChange={(e) => setEditedData({ ...editedData, bloodGroup: e.target.value })}
            placeholder="Blood Group"
          />
            <input
            type="text"
            value={editedData?.weight || ''}
            onChange={(e) => setEditedData({ ...editedData, weight: e.target.value })}
            placeholder="Weight"
          />
          <input
            type="text"
            value={editedData?.address || ''}
            onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
            placeholder="Address"
          />
          <input
            type="tel"
            value={editedData?.phoneNumber || ''}
            onChange={(e) => setEditedData({ ...editedData, phoneNumber: e.target.value })}
            placeholder="Phone Number"
          />
          <input
            type="text"
            value={editedData?.email || ''}
            placeholder="Email"
            disabled
          />
          <h4>Emergency Contact</h4>
          <input
            type="text"
            value={editedData?.emergencyContact?.name || ''}
            onChange={(e) => setEditedData({
              ...editedData,
              emergencyContact: { ...editedData.emergencyContact, name: e.target.value }
            })}
            placeholder="Emergency Contact Name"
          />
          <input
            type="text"
            value={editedData?.emergencyContact?.relationship || ''}
            onChange={(e) => setEditedData({
              ...editedData,
              emergencyContact: { ...editedData.emergencyContact, relationship: e.target.value }
            })}
            placeholder="Relationship"
          />
          <input
            type="tel"
            value={editedData?.emergencyContact?.phoneNumber || ''}
            onChange={(e) => setEditedData({
              ...editedData,
              emergencyContact: { ...editedData.emergencyContact, phoneNumber: e.target.value }
            })}
            placeholder="Emergency Contact Phone"
          />
          <button onClick={handleSaveProfile} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="profile-info">
          <p><i className='bx bx-user'></i> Name: {patientData?.firstName} {patientData?.lastName}</p>
          <p><i className='bx bx-calendar'></i> Date of Birth: {formatDate(patientData?.dateOfBirth)}</p>
          <p><i className='bx bx-male-female'></i> Gender: {patientData?.gender}</p>
          <p><i className='bx bx-droplet'></i> Blood Group: {patientData?.bloodGroup}</p>
          <p><i className='bx bx-map'></i> Address: {patientData?.address}</p>
          <p><i className='bx bx-phone'></i> Phone: {patientData?.phoneNumber}</p>
          <p><i className='bx bx-envelope'></i> Email: {patientData?.email}</p>
          <p><i className='bx bx-data'></i> Weight: {patientData?.weight}</p>

          <h4>Emergency Contact</h4>
          <p><i className='bx bx-user-circle'></i> Name: {patientData?.emergencyContact?.name}</p>
          <p><i className='bx bx-group'></i> Relationship: {patientData?.emergencyContact?.relationship}</p>
          <p><i className='bx bx-phone'></i> Phone: {patientData?.emergencyContact?.phoneNumber}</p>

          <button onClick={handleEdit}><i className='bx bx-edit'></i> Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
