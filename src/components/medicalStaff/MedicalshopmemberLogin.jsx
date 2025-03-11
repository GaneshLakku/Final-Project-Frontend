import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/StaffLogin.css';

const MedicalshopmemberLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/medical-shop/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store token, member ID, and login status in local storage
        localStorage.setItem('medicalShopMemberLoggedIn', 'true');
        localStorage.setItem('medicalShopMemberToken', data.token);
        localStorage.setItem('currentMedicalShopMember', JSON.stringify(data.member));
        localStorage.setItem('medicalShopMemberId', data.member._id); // Store member ID

        // Redirect to dashboard after login
        navigate('/medical-shop-dashboard');
      } else {
        alert(data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-login-container">
      <div className="login-box">
        <h2><i className='bx bx-user-pin card-icon'></i> Medical Shop Member Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group icon-input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group icon-input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-btn btn-with-icon" disabled={loading}>
            {loading ? "Processing..." : <><i className='bx bx-log-in'></i> Login</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalshopmemberLogin;
