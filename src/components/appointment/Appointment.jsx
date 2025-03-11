import { useState } from "react";
import Qr from '../../assets/Qr.jpeg';
import "../../styles/Appointment.css";

const Appointment = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
    time: "",
    date: "",
    type: "",
    file: null,
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => val === "" || val === null)) {
      alert("Please fill in all required fields correctly.");
      return;
    }
    console.log(formData);
    alert("Appointment Booked Successfully");
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
      age: "",
      address: "",
      time: "",
      date: "",
      type: "",
      file: null,
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
      age: "",
      address: "",
      time: "",
      date: "",
      type: "",
      file: null,
    });
    alert("Appointment booking canceled.");
  };

  return (
    <div className="bap">
    <div className="container">
      <h2>Book an Appointment</h2>
      <p>Please fill out the form below to make an appointment</p>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="First Name" id="firstName" value={formData.firstName} onChange={handleChange} required />
        <input type="text" placeholder="Last Name" id="lastName" value={formData.lastName} onChange={handleChange} required />
        <input type="tel" placeholder="Phone Number" id="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" />
        <select id="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="number" placeholder="Age" id="age" value={formData.age} onChange={handleChange} required min="0" />
        <input type="text" placeholder="Address" id="address" value={formData.address} onChange={handleChange} required />
        <input type="time" id="time" value={formData.time} onChange={handleChange} required />
        <input type="date" id="date" value={formData.date} onChange={handleChange} required />
        <select id="type" value={formData.type} onChange={handleChange} required>
          <option value="">Select appointment type</option>
          <option value="normal">Normal</option>
          <option value="emergency">Emergency</option>
        </select>
        <div className="Qr">
          <img src={Qr} alt="QR Image" />
          <h2>Appointment Fee 300</h2>
        </div>
        <input type="file" id="file" onChange={handleChange} />
        <div className="buttons">
          <button type="submit" className="book-btn">Book Appointment</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

    </div>
    </div>
  );
};

export default Appointment;
