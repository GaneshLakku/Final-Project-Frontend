import React, { useState, useEffect } from 'react';
import PrescriptionDetails from './PrescriptionDetails';

// Simple Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={styles.closeButton}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
  },
};

const GiveMedicines = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/patients/search-patients?query=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.patients || []);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/patients/search-patients?query=${encodeURIComponent(searchQuery)}`);

      if (response.ok) {
        const data = await response.json();
        if (data.patients && data.patients.length > 0) {
          setPatientProfile(data.patients[0]);
        } else {
          setPatientProfile(null);
          alert('Patient not found');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch patients');
      }
    } catch (error) {
      setError(error.message);
      console.error("Error searching for patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    setShowFullDetails(true);
  };

  const handleHideDetails = () => {
    setShowFullDetails(false);
  };

  const handleCloseProfile = () => {
    setPatientProfile(null);
    setSearchQuery('');
  };

  const handleViewPrescription = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        margin: '100px auto',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Search Patient</h2>
      <form onSubmit={handleSearch} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder="Search by email or full name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchQuery && suggestions.length > 0 && (
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px', border: '1px solid #ddd', borderRadius: '4px', maxHeight: '100px', overflowY: 'auto' }}>
            {suggestions.map((patient, index) => (
              <li
                key={index}
                style={{ padding: '8px', borderBottom: '1px solid #ddd', cursor: 'pointer' }}
                onClick={() => {
                  setSearchQuery(`${patient.firstName} ${patient.lastName}`);
                  setPatientProfile(patient);
                  setSuggestions([]);
                }}
              >
                {patient.firstName} {patient.lastName}
              </li>
            ))}
          </ul>
        )}
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {patientProfile && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', maxWidth: '300px', position: 'relative' }}>
          <button
            onClick={handleCloseProfile}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '1.2em',
              cursor: 'pointer',
            }}
          >
            &times;
          </button>
          <h3>Patient Profile</h3>
          <p><strong>Name:</strong> {patientProfile.firstName} {patientProfile.lastName}</p>
          <p><strong>Email:</strong> {patientProfile.email}</p>
          <p><strong>Contact:</strong> {patientProfile.phoneNumber}</p>
          {showFullDetails && (
            <div>
              <p><strong>Date of Birth:</strong> {new Date(patientProfile.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {patientProfile.gender}</p>
              <p><strong>Blood Group:</strong> {patientProfile.bloodGroup}</p>
              <p><strong>Address:</strong> {patientProfile.address}</p>
              <p><strong>Emergency Contact:</strong> {patientProfile.emergencyContact?.name} ({patientProfile.emergencyContact?.relationship}) - {patientProfile.emergencyContact?.phoneNumber}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={showFullDetails ? handleHideDetails : handleViewDetails}
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {showFullDetails ? 'Hide Details' : 'View Details'}
            </button>
            <button
              onClick={handleViewPrescription}
              style={{
                padding: '10px 15px',
                backgroundColor: '#FFA500',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              View Prescription
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {patientProfile && <PrescriptionDetails patientId={patientProfile._id} />}
      </Modal>
    </div>
  );
};

export default GiveMedicines;
