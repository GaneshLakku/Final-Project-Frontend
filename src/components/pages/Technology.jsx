import React from 'react';
import 'boxicons/css/boxicons.min.css';
import '../../styles/Technology.css';

const Technology = () => {
    return (
        <div className="technology">
            <div className="main-technology">
                <div className="inner-technology">
                    <i className="bx bxs-clinic bx-flip-horizontal"></i>
                    <h2>Quality & Safety</h2>
                    <p>Our Delmont hospital utilizes state of the art technology and employs cutting-edge solutions.</p>
                </div>

                <div className="inner-technology">
                    <i className="bx bxs-donate-blood"></i>
                    <h2>Quality & Safety</h2>
                    <p>Our Delmont hospital utilizes state of the art technology and employs cutting-edge solutions.</p>
                </div>

                <div className="inner-technology">
                    <i className="bx bx-plus-medical bx-rotate-180"></i>
                    <h2>Quality & Safety</h2>
                    <p>Our Delmont hospital utilizes state of the art technology and employs cutting-edge solutions.</p>
                </div>
            </div>
        </div>
    );
};

export default Technology;
