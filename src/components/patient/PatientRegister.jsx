import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PatientRegister.css";

const PatientRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    weight: "",
    address: "",
    phoneNumber: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested object (emergencyContact)
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prevState) => ({
        ...prevState,
        emergencyContact: {
          ...prevState.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/patients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      alert("Registration Successful! Please login.");
      navigate("/patient-login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-register-container">
      <div className="register-box">
        <h2>Patient Registration</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="date" name="dateOfBirth" placeholder="Date Of Birth" value={formData.dateOfBirth} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <input type="text" name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="number" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
          </div>

          {/* Emergency Contact Section */}
          <h3>Emergency Contact</h3>
          <div className="form-group">
            <input type="text" name="emergencyContact.name" placeholder="Contact Name" value={formData.emergencyContact.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="text" name="emergencyContact.relationship" placeholder="Relationship" value={formData.emergencyContact.relationship} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="tel" name="emergencyContact.phoneNumber" placeholder="Contact Phone Number" value={formData.emergencyContact.phoneNumber} onChange={handleChange} />
          </div>

          <div className="button-group">
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/patient-login")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegister;
