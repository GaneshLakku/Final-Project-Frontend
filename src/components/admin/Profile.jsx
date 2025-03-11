import React, { useEffect, useState } from 'react';

const Profile = ({ adminData, adminId }) => {
  const [adminDetails, setAdminDetails] = useState(adminData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(adminData || {});
  const [loading, setLoading] = useState(false);

  console.log("Admin ID received in Profile:", adminId); // Should now print the correct ID
  console.log("Admin Data received in Profile:", adminData);

  // Fetch Admin Details from API if needed
  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!adminId) return;

      try {
        const response = await fetch(`http://localhost:5000/api/admins/${adminId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch admin details');
        }
        const data = await response.json();
        setAdminDetails(data);
        setEditedData(data);
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdminDetails();
  }, [adminId]);

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/admins/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update admin details');
      }

      const updatedData = await response.json();
      setAdminDetails(updatedData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2 className="section-title">
        <i className='bx bx-user-circle'></i> Admin Profile
      </h2>
      {isEditing ? (
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={editedData.firstName || ''}
              onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={editedData.lastName || ''}
              onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editedData.email || ''}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={editedData.phoneNumber || ''}
              onChange={(e) => setEditedData({ ...editedData, phoneNumber: e.target.value })}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <p><i className='bx bx-id-card'></i> Admin ID: {adminId || 'Not available'}</p>
          <p><i className='bx bx-user'></i> Name: {adminDetails?.firstName} {adminDetails?.lastName}</p>
          <p><i className='bx bx-envelope'></i> Email: {adminDetails?.email}</p>
          <p><i className='bx bx-phone'></i> Phone: {adminDetails?.phoneNumber || 'Not set'}</p>
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            <i className='bx bx-edit'></i> Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
