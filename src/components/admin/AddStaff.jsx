import React, { useState } from 'react';

const AddStaff = ({ setNewStaff }) => {
  const [newStaff, setLocalNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const positions = ["Nurse", "Doctor", "Technician", "Administrator", "Receptionist"];
  const departments = ["Emergency", "Surgery", "Pediatrics", "Radiology", "Cardiology"];

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/staff/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newStaff)
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(`Staff registered successfully. Default password is 'Staff@123'. Please ask the staff member to reset it.`);
        setMessage({ type: "success", text: data.message });
        setLocalNewStaff({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          position: '',
          department: ''
        });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to register staff." });
    }
    setLoading(false);
  };

  return (
    <div className="add-staff-section">
      <h2 className="section-title">
        <i className='bx bx-user-plus'></i> Add New Staff
      </h2>
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      <form onSubmit={handleAddStaff} className="staff-form">
        <div className="form-row">
          <div className="form-group">
            <label><i className='bx bx-user'></i> First Name</label>
            <input
              type="text"
              value={newStaff.firstName}
              onChange={(e) => setLocalNewStaff({...newStaff, firstName: e.target.value})}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="form-group">
            <label><i className='bx bx-user'></i> Last Name</label>
            <input
              type="text"
              value={newStaff.lastName}
              onChange={(e) => setLocalNewStaff({...newStaff, lastName: e.target.value})}
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
              value={newStaff.email}
              onChange={(e) => setLocalNewStaff({...newStaff, email: e.target.value})}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group">
            <label><i className='bx bx-phone'></i> Phone Number</label>
            <input
              type="tel"
              value={newStaff.phoneNumber}
              onChange={(e) => setLocalNewStaff({...newStaff, phoneNumber: e.target.value})}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label><i className='bx bx-briefcase'></i> Position</label>
            <select
              value={newStaff.position}
              onChange={(e) => setLocalNewStaff({...newStaff, position: e.target.value})}
              required
            >
              <option value="">Select Position</option>
              {positions.map((pos, index) => (
                <option key={index} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label><i className='bx bx-building'></i> Department</label>
            <select
              value={newStaff.department}
              onChange={(e) => setLocalNewStaff({...newStaff, department: e.target.value})}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="button-group">
          <button type="submit" className="add-btn" disabled={loading}>
            <i className='bx bx-user-plus'></i> {loading ? "Adding..." : "Add Staff"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setLocalNewStaff({
              firstName: '',
              lastName: '',
              email: '',
              phoneNumber: '',
              position: '',
              department: ''
            })}
          >
            <i className='bx bx-x'></i> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
