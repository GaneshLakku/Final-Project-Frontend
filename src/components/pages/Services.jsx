import React from 'react';
import '../../styles/Services.css';

const Services = () => {
  const services = [
    { id: 1, icon: 'bxs-truck', title: '24/7 Ambulance Services', description: 'We offer extensive medical procedures to outbound & inbound patients. We are very proud of our staff.' },
    { id: 2, icon: 'bxs-buildings', title: 'Well and Good construction1', description: 'We offer extensive medical procedures to outbound & inbound patients. We are very proud of our staff.' },
    { id: 3, icon: 'bxs-heart', title: 'Provide Blood Donation', description: 'We offer extensive medical procedures to outbound & inbound patients. We are very proud of our staff.' },
    { id: 4, icon: 'bx-layer-plus', title: 'Keep patient Records', description: 'We offer extensive medical procedures to outbound & inbound patients. We are very proud of our staff.' },
    { id: 5, icon: 'bx-list-ul', title: 'Update Records', description: 'We offer extensive medical procedures to outbound & inbound patients. We are very proud of our staff.' },
    { id: 6, icon: 'bx-upload', title: 'User Friendly', description: 'We offer extensive medical procedures to outbound & inbound patients. We are very proud of our staff.' },
  ];

  return (
    <div className="our-service" id="services">
      <div className="service-heading">
        <h2>Our Services</h2>
      </div>

      <div className="main-services">
        {services.map((service) => (
          <div className="inner-services" key={service.id}>
            <div className="service-icon">
              <i className={`bx ${service.icon}`}></i> {/* This assumes you're using Boxicons */}
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
