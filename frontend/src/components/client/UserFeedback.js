import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/UserFeedback.css';

import ElonMuskImage from '../../assets/images/client/ElonMusk.jpg';
import BillGatesImage from '../../assets/images/client/BillGates.jpg';
import OprahWinfreyImage from '../../assets/images/client/Winfrey.jpg';
import RonaldoImage from '../../assets/images/client/ronaldo.jpg';

const feedbacks = [
    {
        id: 1,
        name: 'Elon Musk',
        country: 'USA',
        review: 'An outstanding service! I am truly impressed with the quality and professionalism.',
        rating: 5,
        image: ElonMuskImage,
    },
    {
        id: 2,
        name: 'Bill Gates',
        country: 'USA',
        review: 'Innovative, reliable, and top-notch. Highly recommended for everyone.',
        rating: 5,
        image: BillGatesImage,
    },
    {
        id: 3,
        name: 'Oprah Winfrey',
        country: 'USA',
        review: 'It’s a game-changer. Absolutely loved it!',
        rating: 5,
        image: OprahWinfreyImage,
    },
    {
        id: 4,
        name: 'Cristiano Ronaldo',
        country: 'Portugal',
        review: 'A truly exceptional experience. Worth every bit of praise.',
        rating: 5,
        image: RonaldoImage,
    },
];
const UserFeedback = () => {
    return (
        <section className="user-feedback py-5">
            <div className="container text-center">
                <h2 className="section-title mb-4">
                    User <span className="highlight">Feedback</span>
                </h2>
                <p className="section-subtitle mb-5">
                See what our satisfied customers have to say about their booking experience
                </p>

                <div className="row justify-content-center g-4">
                    {feedbacks.map((feedback) => (
                        <div key={feedback.id} className="col-md-3">
                            <div className="feedback-card p-3 rounded shadow-sm bg-white">
                                <div className="avatar mx-auto mb-3">
                                    <img
                                        src={feedback.image}
                                        alt={feedback.name}
                                        className="rounded-circle"
                                        width="80"
                                        height="80"
                                    />
                                </div>
                                <p className="feedback-review">{feedback.review}</p>
                                <div className="rating mb-2">
                                    {Array(feedback.rating)
                                        .fill()
                                        .map((_, index) => (
                                            <span key={index} className="star">
                                                ⭐
                                            </span>
                                        ))}
                                </div>
                                <h5 className="feedback-name mb-0">{feedback.name}</h5>
                                <small className="feedback-country">{feedback.country}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserFeedback;
