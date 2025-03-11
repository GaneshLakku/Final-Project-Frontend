import React, { useState } from 'react';

const AddMedicalShopMember = ({ setNewMember }) => {
  const [newMember, setLocalNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    shopId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/medical-shop/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newMember)
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: `Medical Shop Member ${newMember.firstName} ${newMember.lastName} registered successfully.` });
        setShowModal(true);

        setLocalNewMember({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          shopId: ''
        });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to register medical shop member." });
    }
    setLoading(false);
  };

  return (
    <div className="add-member-section">
      <h2 className="section-title">
        <i className='bx bx-user-plus'></i> Add Medical Shop Member
      </h2>
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      <form onSubmit={handleAddMember} className="member-form">
        <div className="form-row">
          <div className="form-group">
            <label><i className='bx bx-user'></i> First Name</label>
            <input
              type="text"
              value={newMember.firstName}
              onChange={(e) => setLocalNewMember({...newMember, firstName: e.target.value})}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="form-group">
            <label><i className='bx bx-user'></i> Last Name</label>
            <input
              type="text"
              value={newMember.lastName}
              onChange={(e) => setLocalNewMember({...newMember, lastName: e.target.value})}
              placeholder="Enter last name"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label><i className='bx bx-envelope'></i> Email</label>
            <input
              type="email"
              value={newMember.email}
              onChange={(e) => setLocalNewMember({...newMember, email: e.target.value})}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group">
            <label><i className='bx bx-phone'></i> Phone Number</label>
            <input
              type="tel"
              value={newMember.phoneNumber}
              onChange={(e) => setLocalNewMember({...newMember, phoneNumber: e.target.value})}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label><i className='bx bx-store'></i> Shop ID</label>
          <input
            type="text"
            value={newMember.shopId}
            onChange={(e) => setLocalNewMember({...newMember, shopId: e.target.value})}
            placeholder="Enter shop ID"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="add-btn" disabled={loading}>
            <i className='bx bx-user-plus'></i> {loading ? "Adding..." : "Add Member"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setLocalNewMember({
              firstName: '',
              lastName: '',
              email: '',
              phoneNumber: '',
              shopId: ''
            })}
          >
            <i className='bx bx-x'></i> Cancel
          </button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">Member Added</h3>
            <p>{message?.text}</p>
            <p><strong>Default Password:</strong> Medical@123</p>
            <button className="btn close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedicalShopMember;
