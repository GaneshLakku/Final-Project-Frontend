import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/pages/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Gallery from './components/pages/Gallery';
import Services from './components/pages/Services';
import Technology from './components/pages/Technology';
import Reviews from './components/pages/Review';
import Contact from './components/pages/Contact';
import PatientLogin from './components/patient/PatientLogin';
import PatientRegister from './components/patient/PatientRegister';
import AdminLogin from './components/admin/AdminLogin';
import DoctorLogin from './components/doctor/DoctorLogin';
import PatientDashboard from './components/patient/PatientDashboard';
import StaffLogin from './components/staff/StaffLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import MedicalshopmemberLogin from './components/medicalStaff/MedicalshopmemberLogin';
import MedicalShopdashboard from './components/medicalStaff/MedicalShopdashboard';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-content">
                <Home />
                <About />
                <Gallery />
                <Services />
                <Technology />
                <Reviews />
                <Contact />
              </div>
            }
          />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          {/* <Route path="/medicalshop-login" element={<MedicalshopmemberLogin />} /> */}
          <Route path="/medical-shop-dashboard" element={<MedicalShopdashboard />} />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
