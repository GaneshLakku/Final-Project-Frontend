import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg'
import "../../styles/Navbar.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLoginClick = () => {
    setShowDropdown(false);  // Close the dropdown
  };
  

  return (
    <header className={isHomePage ? 'full-header' : 'simple-header'}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      
      {isHomePage ? (
        // Full navbar for homepage
        <>
          <nav className="navbar">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#gallery">Gallery</a>
            <a href="#services">Services</a>
            <a href="#reviews">Reviews</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="Btn">
            <div className="nav-dropdown">
              <button className="login-btn" onClick={toggleDropdown}>
                Login
              </button>
              {showDropdown && (
  <div className="dropdown-menu">
    <Link to="/patient-login" onClick={handleLoginClick} className="dropdown-item">
      Patient Login
    </Link>
    <Link to="/doctor-login" onClick={handleLoginClick} className="dropdown-item">
      Doctor Login
    </Link>
    <Link to="/staff-login" onClick={handleLoginClick} className="dropdown-item">
      Staff Login
    </Link>
    <Link to="/admin-login" onClick={handleLoginClick} className="dropdown-item">
      Admin Login
    </Link>
  </div>
)}

            </div>
          </div>
        </>
      ) : (
        // Simplified navbar for other pages
        <div className="simple-nav">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className='bx bx-arrow-back'></i> Back
          </button>
          <div className="nav-dropdown">
            <button className="login-btn" onClick={toggleDropdown}>
              Login
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/patient-login" onClick={handleLoginClick} className="dropdown-item">
                  Patient Login
                </Link>
                <Link to="/doctor-login" onClick={handleLoginClick} className="dropdown-item">
                  Doctor Login
                </Link>
                <Link to="/staff-login" onClick={handleLoginClick} className="dropdown-item">
                  Staff Login
                </Link>
                <Link to="/admin-login" onClick={handleLoginClick} className="dropdown-item">
                  Admin Login
                </Link>

                <Link to="/medicalshop-login" onClick={handleLoginClick} className="dropdown-item">
                  Medical Shop Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;