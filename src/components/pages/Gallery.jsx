import React from 'react';
import team1 from '../../assets/team1.jpeg' 
import team2 from '../../assets/team2.jpeg'
import team3 from '../../assets/team3.jpeg'
import team4 from '../../assets/team4.jpeg'
import team5 from '../../assets/team5.jpeg'
import team6 from '../../assets/team6.jpeg'
import '../../styles/Gallery.css';

const Gallery = () => {
  const doctors = [
    { id: 1, name: 'Mr Joe', imgSrc: team1 },
    { id: 2, name: 'Mr Joe', imgSrc: team2 },
    { id: 3, name: 'Mr Joe', imgSrc: team3 },
    { id: 4, name: 'Mr Joe', imgSrc: team4 },
    { id: 5, name: 'Mr Joe', imgSrc: team5 },
    { id: 6, name: 'Mr Joe', imgSrc: team6 },
  ];

  return (
    <div className="main-doctors" id="gallery">
      <div className="doctors-heading">
        <h2>Our Doctors</h2>
      </div>

      <div className="main-inner-doctor">
        {doctors.map((doctor) => (
          <div className="doc-poster" key={doctor.id}>
            <div className="doc-icons">
              <i className="bx bxs-share"></i>
              <i className="bx bxs-low-vision"></i>
              <i className="bx bxs-heart"></i>
            </div>
            <img src={doctor.imgSrc} alt={doctor.name} />

            <div className="doc-details">
              <h2>{doctor.name}</h2>

              <i className="bx bxl-linkedin"></i>
              <i className="bx bxl-instagram-alt"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
