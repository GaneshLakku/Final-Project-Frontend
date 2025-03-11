import React, { useState, useEffect } from 'react';

const MedicalstaffProfile = ({ staffData }) => {
  const [profile, setProfile] = useState(staffData || {});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const memberId = localStorage.getItem('medicalShopMemberId');
        if (!memberId) {
          console.error("Member ID not found in local storage");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/medical-shop/members/${memberId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('medicalShopMemberToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          setProfile(data.member);
          console.log("Profile state updated:", data.member);
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  console.log("Current profile state:", profile);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        margin: '100px auto', // Adjusted margin to move the card down
        marginLeft: '70px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333' }}>Staff Profile</h2>
      {profile && profile._id ? (
        <div>
          <p style={{ fontSize: '1.2em', margin: '10px 0' }}>
            <strong>Name:</strong> {profile.firstName} {profile.lastName}
          </p>
          <p style={{ fontSize: '1.2em', margin: '10px 0' }}>
            <strong>Email:</strong> {profile.email}
          </p>
          <p style={{ fontSize: '1.2em', margin: '10px 0' }}>
            <strong>Phone Number:</strong> {profile.phoneNumber}
          </p>
          <p style={{ fontSize: '1.2em', margin: '10px 0' }}>
            <strong>Shop ID:</strong> {profile.shopId}
          </p>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#777' }}>Loading profile data...</p>
      )}
    </div>
  );
};

export default MedicalstaffProfile;
