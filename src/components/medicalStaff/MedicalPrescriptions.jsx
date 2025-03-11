import React, { useState } from 'react';

const MedicalPrescriptions = ({ prescription, onClose }) => {
  const [prescriptions, setPrescriptions] = useState([prescription]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (index, medIndex, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index].medicines[medIndex][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleInstructionsChange = (index, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index].instructions = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handlePaymentToggle = (index) => {
    const updatedPrescriptions = [...prescriptions];
    const currentStatus = updatedPrescriptions[index].paymentStatus;
    updatedPrescriptions[index].paymentStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    setPrescriptions(updatedPrescriptions);
  };

  const calculateTotalAmount = (medicines) => {
    return medicines.reduce((total, medicine) => {
      return total + (medicine.price * medicine.quantity);
    }, 0);
  };

  const handleSubmit = async (index) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/medical-transactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: prescriptions[index].patient._id,
          prescriptionId: prescriptions[index]._id,
          medicines: prescriptions[index].medicines.map(medicine => ({
            name: medicine.name,
            price: medicine.price,
            quantity: medicine.quantity,
            instruction: medicine.instruction || '', // Ensure instruction is included
          })),
          paymentStatus: prescriptions[index].paymentStatus, // Include paymentStatus from frontend
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Transaction created successfully:', data);
        // Close the modal after successful submission
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create medical transaction');
      }
    } catch (error) {
      setError(error.message);
      console.error("Error creating medical transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Medical Prescriptions</h2>
      {prescriptions.length > 0 ? (
        <ul style={listStyle}>
          {prescriptions.map((prescription, index) => (
            <li key={index} style={listItemStyle}>
              <h3 style={subHeaderStyle}>Prescription Details</h3>
              <p><strong>Doctor:</strong> {prescription.doctor?.firstName} {prescription.doctor?.lastName}</p>
              <p><strong>Patient:</strong> {prescription.patient?.firstName} {prescription.patient?.lastName}</p>
              <p><strong>Medicines:</strong></p>
              <ul style={medicineListStyle}>
                {prescription.medicines.map((medicine, medIndex) => (
                  <li key={medIndex} style={medicineItemStyle}>
                    {medicine.name} - {medicine.dosage}
                    <div>
                      <label>
                        Quantity:
                        <input
                          type="number"
                          value={medicine.quantity || ''}
                          onChange={(e) => handleInputChange(index, medIndex, 'quantity', Number(e.target.value))}
                          style={inputStyle}
                        />
                      </label>
                      <label>
                        Price:
                        <input
                          type="number"
                          value={medicine.price || ''}
                          onChange={(e) => handleInputChange(index, medIndex, 'price', Number(e.target.value))}
                          style={inputStyle}
                        />
                      </label>
                      <label>
                        Instruction:
                        <input
                          type="text"
                          value={medicine.instruction || ''}
                          onChange={(e) => handleInputChange(index, medIndex, 'instruction', e.target.value)}
                          style={inputStyle}
                        />
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
              <label>
                Instructions:
                <textarea
                  value={prescription.instructions || ''}
                  onChange={(e) => handleInstructionsChange(index, e.target.value)}
                  style={textareaStyle}
                />
              </label>
              <p><strong>Total Amount:</strong> {calculateTotalAmount(prescription.medicines).toFixed(2)}</p>
              <p><strong>Payment Status:</strong> {prescription.paymentStatus}
                <button onClick={() => handlePaymentToggle(index)} style={paymentToggleButtonStyle}>
                  {prescription.paymentStatus === 'pending' ? 'Mark as Paid' : 'Mark as Pending'}
                </button>
              </p>
              <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
              <button onClick={() => handleSubmit(index)} style={submitButtonStyle} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              {error && <p style={errorStyle}>{error}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p style={noPrescriptionsStyle}>No prescriptions found.</p>
      )}
    </div>
  );
};

// Inline styles
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  maxWidth: '600px',
  margin: 'auto',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  fontSize: '24px',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
};

const listItemStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const subHeaderStyle = {
  fontSize: '20px',
  marginBottom: '10px',
};

const medicineListStyle = {
  listStyleType: 'none',
  paddingLeft: '20px',
};

const medicineItemStyle = {
  marginBottom: '5px',
};

const inputStyle = {
  marginLeft: '10px',
  padding: '5px',
  width: '60px',
};

const textareaStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '10px',
  boxSizing: 'border-box',
};

const paymentToggleButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '10px',
};

const submitButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px',
};

const errorStyle = {
  color: 'red',
  marginTop: '10px',
};

const noPrescriptionsStyle = {
  textAlign: 'center',
  color: '#777',
};

export default MedicalPrescriptions;
