import React, { useEffect, useState } from 'react';

const StaffProfile = () => {
  const [staffData, setStaffData] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      const staffId = localStorage.getItem('staffId');
      const staffToken = localStorage.getItem('staffToken');

      try {
        const response = await fetch(`http://localhost:5000/api/staff/${staffId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${staffToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setStaffData(data.staff);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffData();
  }, []);

  if (!staffData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-section">
      <h2 className="section-title">
        <i className='bx bx-user-circle'></i> Staff Profile
      </h2>
      <div className="profile-info">
        <div className="info-card">
          <p><i className='bx bx-user'></i> Name: {staffData.firstName} {staffData.lastName}</p>
          <p><i className='bx bx-envelope'></i> Email: {staffData.email}</p>
          <p><i className='bx bx-briefcase'></i> Position: {staffData.position}</p>
          <p><i className='bx bx-building'></i> Department: {staffData.department}</p>
          <p><i className='bx bx-phone'></i> Phone: {staffData.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
