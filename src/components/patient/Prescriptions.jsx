import React, { useState, useEffect } from 'react';

const Prescriptions = ({ patientData }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!patientData?._id) {
        setError('Patient ID is missing.');
        setLoading(false);
        return;
      }

      try {
        // Fetch prescriptions for the patient
        const response = await fetch(`http://localhost:5000/api/appointments/prescriptions/patient/${patientData._id}`);
        if (response.ok) {
          const data = await response.json();
          const sortedPrescriptions = data.prescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));

          // Fetch detailed prescription data including doctor details
          const detailedPrescriptions = await Promise.all(
            sortedPrescriptions.map(async (prescription) => {
              const detailResponse = await fetch(`http://localhost:5000/api/appointments/prescriptions/${prescription._id}`);
              if (detailResponse.ok) {
                const detailData = await detailResponse.json();
                console.log(detailData);
                return {
                  ...detailData.prescription,
                  doctor: detailData.prescription.doctor, // Ensure doctor details are included
                };
              }
              throw new Error('Failed to fetch detailed prescription');
            })
          );

          setPrescriptions(detailedPrescriptions);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch prescriptions');
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientData?._id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="prescriptions-section">
      <h2 className="section-title">
        <i className='bx bx-capsule'></i> Prescriptions
      </h2>

      <div className="prescriptions-list">
        {prescriptions.length === 0 ? (
          <div className="no-prescriptions">
            <i className='bx bx-message-alt-x'></i>
            <p>No prescriptions available</p>
          </div>
        ) : (
          prescriptions.map(prescription => (
            <div key={prescription._id} className="prescription-card">
              <div className="prescription-header">
                <div className="doctor-info">
                  <h3>
                    <i className='bx bx-user-circle'></i>
                    Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                  </h3>
                  <span className="specialization">
                    <i className='bx bx-clinic'></i>
                    {prescription.doctor?.specialization}
                  </span>
                </div>
                <div className="date-time">
                  <span>
                    <i className='bx bx-calendar'></i>
                    {new Date(prescription.date).toLocaleDateString()}
                  </span>
                  <span>
                    <i className='bx bx-time'></i>
                    {new Date(prescription.date).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="prescription-content">
                <h4>
                  <i className='bx bx-notepad'></i>
                  Prescription
                </h4>
                <ul>
                  {prescription.medicines.map((medicine, index) => (
                    <li key={index}>
                     MedicineName :   {medicine.name}    -   Dosage :  {medicine.dosage}
                    </li>
                  ))}
                </ul>
                <p> Note : {prescription.notes}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
