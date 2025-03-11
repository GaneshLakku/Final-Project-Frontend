import React from "react";
import about4 from '../../assets/about4.jpeg'
import blurbg1 from '../../assets/blurbg1.jpeg'
import '../../styles/Home.css';

const Home = () => {
  return (
    <div className="main-home" id="home" style={{ backgroundImage: `url(${blurbg1})` }}>
      <div className="home">
        <div className="home-left-content">
          <span>Welcome to Hospital Management</span>
          <h2>
            We take Care Our
            <br />
            Patients Health
          </h2>
          <p className="lorem">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            numquam veniam porro eius, fugiat vero ut ipsum libero
          </p>
          <div className="home_btn">
            <a href="">Read More</a>
          </div>
        </div>
        <div className="home-right-content">
          <img src={about4}alt="About Us" />
        </div>
      </div>
    </div>
  );
};

export default Home;
