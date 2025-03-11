import React, { useState } from 'react';

const AddDoctor = () => {
  const [newDoctor, setNewDoctor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    qualification: '',
    experience: '',
    phoneNumber: '',
    fees: ''
  });
  const handleAddDoctor = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('adminToken'); // Correct key name
  
    if (!token) {
      console.error("No token found. Please log in.");
      alert("Unauthorized: Please log in.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/doctors/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // Attach the correct token
        },
        body: JSON.stringify(newDoctor),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        setNewDoctor({
          firstName: '',
          lastName: '',
          email: '',
          specialization: '',
          qualification: '',
          experience: '',
          phoneNumber: '',
          fees: ''
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  return (
    <div className="add-doctor-section">
      <h2 className="section-title">
        <i className='bx bx-plus-medical'></i> Add New Doctor
      </h2>
      <form onSubmit={handleAddDoctor} className="doctor-form">
        <div className="form-row">
          <div className="form-group">
            <label><i className='bx bx-user'></i> First Name</label>
            <input
              type="text"
              value={newDoctor.firstName}
              onChange={(e) => setNewDoctor({...newDoctor, firstName: e.target.value})}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="form-group">
            <label><i className='bx bx-user'></i> Last Name</label>
            <input
              type="text"
              value={newDoctor.lastName}
              onChange={(e) => setNewDoctor({...newDoctor, lastName: e.target.value})}
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
              value={newDoctor.email}
              onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group">
            <label><i className='bx bx-phone'></i> Phone Number</label>
            <input
              type="tel"
              value={newDoctor.phoneNumber}
              onChange={(e) => setNewDoctor({...newDoctor, phoneNumber: e.target.value})}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label><i className='bx bx-clinic'></i> Specialization</label>
            <select
              value={newDoctor.specialization}
              onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
              required
            >
              <option value="">Select Specialization</option>
              <option value="General Doctor">General Doctor</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Surgeon">Surgeon</option>
            </select>
          </div>
          <div className="form-group">
            <label><i className='bx bx-book'></i> Qualification</label>
            <input
              type="text"
              value={newDoctor.qualification}
              onChange={(e) => setNewDoctor({...newDoctor, qualification: e.target.value})}
              placeholder="Enter qualification"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label><i className='bx bx-time'></i> Experience (years)</label>
            <input
              type="number"
              value={newDoctor.experience}
              onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
              placeholder="Years of experience"
              required
            />
          </div>
          <div className="form-group">
            <label><i className='bx bx-money'></i> Fees</label>
            <input
              type="number"
              value={newDoctor.fees}
              onChange={(e) => setNewDoctor({...newDoctor, fees: e.target.value})}
              placeholder="Consultation fees"
              required
            />
          </div>
        </div>
        <div className="button-group">
          <button type="submit" className="add-btn">
            <i className='bx bx-plus-medical'></i> Add Doctor
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setNewDoctor({
              firstName: '',
              lastName: '',
              email: '',
              specialization: '',
              qualification: '',
              experience: '',
              phoneNumber: '',
              fees: ''
            })}
          >
            <i className='bx bx-x'></i> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
