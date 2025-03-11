import React, { useEffect, useState } from 'react';

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorId = localStorage.getItem('doctorId'); // Retrieve doctor ID from local storage
        const token = localStorage.getItem('doctorToken'); // Retrieve token from local storage

        if (!doctorId || !token) {
          setError('Unauthorized access. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor details');
        }

        const data = await response.json();
        setDoctorData(data.doctor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-section">
      <h2 className="section-title">
        <i className='bx bx-user-circle'></i> Doctor Profile
      </h2>
      <div className="profile-info">
        <p><i className='bx bx-user'></i> Name: {doctorData?.firstName} {doctorData?.lastName}</p>
        <p><i className='bx bx-envelope'></i> Email: {doctorData?.email}</p>
        <p><i className='bx bx-phone'></i> Phone: {doctorData?.phoneNumber}</p>
        <p><i className='bx bx-clinic'></i> Specialization: {doctorData?.specialization}</p>
        <p><i className='bx bx-file-medical'></i> Qualification: {doctorData?.qualification}</p>
        <p><i className='bx bx-time'></i> Experience: {doctorData?.experience} years</p>
        
      </div>
    </div>
  );
};

export default DoctorProfile;
