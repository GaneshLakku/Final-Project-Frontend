import React from 'react';
import '../../styles/Review.css';
import review1 from '../../assets/review1.jpeg'
import review2 from '../../assets/review2.jpeg'
import review3 from '../../assets/review3.jpeg'
const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'Lara John',
      image: review1,
      reviewText: 'Lorem ipsum, dolor sit amet consectueter elit. Option quod a',
    },
    {
      id: 2,
      name: 'Lara John',
      image: review2,
      reviewText: 'Lorem ipsum, dolor sit amet consectueter elit. Option quod a',
    },
    {
      id: 3,
      name: 'Lara John',
      image: review3,
      reviewText: 'Lorem ipsum, dolor sit amet consectueter elit. Option quod a',
    },
  ];

  return (
    <div className="main-review" id="reviews">
      <div className="review-heading">
        <a href="#"> {/* Add actual link if needed */}
          <h1>Our Customers Review</h1>
        </a>
      </div>

      <div className="main-inner-review">
        {reviews.map((review) => (
          <div className="review-inner-content" key={review.id}>
            <div className="review-box">
              <img src={review.image} alt={review.name} />

              <h2>{review.name}</h2>

              <div className="review-stars">
                <i className="bx bx-star"></i>
                <i className="bx bx-star"></i>
                <i className="bx bx-star"></i>
                <i className="bx bx-star"></i>
                <i className="bx bx-star"></i>
              </div>

              <div className="review-text">
                <p>{review.reviewText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
