import React from "react";
import "../../styles/Contact.css"; // Ensure the CSS file is included

const Contact = () => {
  return (
    <div className="main-contact" id="contact">
      <div className="contact-heading">
        <h1>Contact Us</h1>
      </div>
      
      <div className="contact-container">
        <div className="contact-box">
          <i className="bx bxs-envelope"></i>
          <h3>Email Address</h3>
          <p>info@hospitalcare.com</p>
          <p>support@hospitalcare.com</p>
        </div>
        
        <div className="contact-box">
          <i className="bx bxs-phone"></i>
          <h3>Phone Number</h3>
          <p>+1 (555) 123-4567</p>
          <p>+1 (555) 987-6543</p>
        </div>
        
        <div className="contact-box">
          <i className="bx bxs-map"></i>
          <h3>Location</h3>
          <p>123 Healthcare Avenue</p>
          <p>Medical District, NY 10001</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
