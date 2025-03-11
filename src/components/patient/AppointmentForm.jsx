import React, { useState } from 'react';

const AppointmentForm = () => {
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    appointmentType: 'normal',
    isEmergency: false,
    symptoms: ''
  });

  const patientId = sessionStorage.getItem('patientId');
  const token = sessionStorage.getItem('token');

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
  
    const { date, time, appointmentType, symptoms } = appointmentForm;
    const isEmergency = appointmentType === 'emergency';  // Set isEmergency based on appointmentType
    const assignedDoctor = isEmergency ? '67bdaaad2a42bea22493703d' : null;
    const assignedStaff = isEmergency ? null : '67bdc2546302f935b3251d6b';
  
    const appointmentData = {
      patientId,
      dateTime: `${date}T${time}:00`,
      type: appointmentType,
      isEmergency,
      symptoms: isEmergency ? symptoms : [],
      doctor: assignedDoctor,
      staff: assignedStaff
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Appointment booked successfully!');
        setAppointmentForm({
          date: '',
          time: '',
          appointmentType: 'normal',
          isEmergency: false,
          symptoms: ''
        });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to book appointment. Please try again.');
      console.error('Error while booking appointment:', error);
    }
  };

  return (
    <div className="appointment-section">
      <h3>Book Appointment</h3>
      <form onSubmit={handleAppointmentSubmit}>
        <div className="form-group">
          <input
            type="date"
            value={appointmentForm.date}
            onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="time"
            value={appointmentForm.time}
            onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <select
            value={appointmentForm.appointmentType}
            onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentType: e.target.value })}
            required
          >
            <option value="normal">Normal</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
        {appointmentForm.appointmentType === 'emergency' && (
          <div className="form-group">
            <textarea
              value={appointmentForm.symptoms}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, symptoms: e.target.value })}
              placeholder="Symptoms"
              required
            />
          </div>
        )}
        <div className="button-group">
          <button type="submit" className="book-btn">Book Appointment</button>
          <button type="reset" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
