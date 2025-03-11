import React, { useState, useEffect } from 'react';
import MedicalPrescriptions from './MedicalPrescriptions';

const PrescriptionDetails = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/prescriptions/patient/${patientId}`);
        if (!response.ok) throw new Error('Failed to fetch prescription details');

        const data = await response.json();
        const detailedPrescriptions = await Promise.all(
          data.prescriptions.map(async (prescription) => {
            const detailResponse = await fetch(`http://localhost:5000/api/appointments/prescriptions/${prescription._id}`);
            if (!detailResponse.ok) throw new Error('Failed to fetch detailed prescription');

            const detailData = await detailResponse.json();
            return {
              ...detailData.prescription,
              patientName: data.patientName // Ensure patientName is included
            };
          })
        );

        setPrescriptions(detailedPrescriptions.filter(Boolean));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionDetails();
  }, [patientId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const sortedPrescriptions = [...prescriptions].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedPrescription(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Prescription Details</h2>
      {sortedPrescriptions.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th style={headerCellStyle}>Doctor Name</th>
              <th style={headerCellStyle}>Medicines</th>
              <th style={headerCellStyle}>Dosage</th>
              <th style={headerCellStyle}>Date</th>
              <th style={headerCellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrescriptions.map((prescription) => (
              <tr key={prescription._id} style={rowStyle}>
                <td style={cellStyle}>{prescription.doctor?.firstName} {prescription.doctor?.lastName}</td>
                <td style={cellStyle}>{prescription.medicines.map((medicine) => medicine.name).join(', ')}</td>
                <td style={cellStyle}>{prescription.medicines.map((medicine) => medicine.dosage).join(', ')}</td>
                <td style={cellStyle}>{new Date(prescription.date).toLocaleDateString()}</td>
                <td style={cellStyle}>
                  <button onClick={() => handleViewDetails(prescription)} style={buttonStyle}>
                    Add Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No prescription details found.</div>
      )}

      {isModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button onClick={handleCloseDetails} style={closeButtonStyle}>
              &times;
            </button>
            <MedicalPrescriptions prescription={selectedPrescription} onClose={handleCloseDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles
const tableStyle = { width: '100%', borderCollapse: 'collapse', margin: '20px 0' };
const headerRowStyle = { backgroundColor: '#f2f2f2' };
const headerCellStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const rowStyle = { borderBottom: '1px solid #ddd' };
const cellStyle = { padding: '10px', textAlign: 'left' };
const buttonStyle = { padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const modalStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '500px', position: 'relative' };
const closeButtonStyle = { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer' };

export default PrescriptionDetails;
