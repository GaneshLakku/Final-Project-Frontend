import React from 'react';
import about2 from '../../assets/about2.jpeg'
import '../../styles/About.css';

const About = () => {
  return (
    <div className="main-about" id="about">
      <div className="about-heading">About Us</div>
      <div className="inner-main-about">
        <div className="about-inner-content-left">
          <img src={about2} alt="About Us" />
        </div>
        <div className="about-inner-content">
          <div className="about-right-content">
            <h2>
              We're Setting Standards in Research <br />
              What's more, Clinical Care
            </h2>
            <p>
              We provide the most full medical services, so every person could have the opportunity
              <br />
              to receive qualitative medical help.
            </p>
            <p className="about-sec-content">
              Our clinic has grown to provide a world-class facility for the treatment of tooth loss,
              dental cosmetics, and advanced restorative dentistry. We are among the most qualified
              implant providers in the US with over 30 years of quality training and experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
