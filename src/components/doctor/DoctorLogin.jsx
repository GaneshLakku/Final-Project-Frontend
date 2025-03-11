import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/DoctorLogin.css';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('doctorLoggedIn') === 'true') {
      navigate('/doctor-dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/doctors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      console.log('Raw Response:', text); // Debugging

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed Data:', data); // Debugging

      if (response.ok && data.token && data.doctorId) {
        localStorage.setItem('doctorToken', data.token);
        localStorage.setItem('doctorId', data.doctorId);
        localStorage.setItem('doctorLoggedIn', 'true');

        // Fetch doctor data and store it
        await fetchDoctorData(data.doctorId, data.token);

        alert('Login Successful!');
        navigate('/doctor-dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorData = async (doctorId, token) => {
    try {
      const doctorResponse = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (doctorResponse.ok) {
        const doctorData = await doctorResponse.json();
        localStorage.setItem('currentDoctor', JSON.stringify(doctorData.doctor));
      } else {
        console.error('Failed to fetch doctor data');
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>
          <i className="bx bx-plus-medical"></i> Doctor Login
        </h2>
        {error && (
          <div className="error-message">
            <i className="bx bx-error-circle"></i> {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="bx bx-envelope"></i> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>
              <i className="bx bx-lock-alt"></i> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="bx bx-loader-alt bx-spin"></i> Logging in...
              </>
            ) : (
              <>
                <i className="bx bx-log-in"></i> Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLogin;
