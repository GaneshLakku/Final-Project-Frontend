import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/StaffLogin.css';

const StaffLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5000/api/staff/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      if (response.ok) {
        // Store the staff data along with token and id
        localStorage.setItem('staffId', data.staffId);  // Storing staffId
        localStorage.setItem('staffToken', data.token);  // Storing token
        localStorage.setItem('staffLoggedIn', 'true');   // Indicating staff is logged in
        localStorage.setItem('currentStaff', JSON.stringify(data));  // Storing entire staff data
  
        alert('Login Successful!');
        navigate('/staff-dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to login. Please try again.");
    }
    setLoading(false);
  };
  

  return (
    <div className="staff-login-container">
      <div className="login-box">
        <h2><i className='bx bx-user-pin card-icon'></i> Staff Login</h2>
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
            {loading ? "Logging in..." : <><i className='bx bx-log-in'></i> Login</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
