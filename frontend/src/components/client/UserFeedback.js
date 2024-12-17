import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/UserFeedback.css';

const feedbacks = [
    {
        id: 1,
        name: 'Elon Musk',
        country: 'USA',
        review: 'An outstanding service! I am truly impressed with the quality and professionalism.',
        rating: 5,
        image: 'https://imgcdn.stablediffusionweb.com/2024/11/12/3a76ea03-959f-4266-a211-c4849b2e65c8.jpg',
    },
    {
        id: 2,
        name: 'Bill Gates',
        country: 'USA',
        review: 'Innovative, reliable, and top-notch. Highly recommended for everyone.',
        rating: 5,
        image: 'https://i.pinimg.com/280x280_RS/7c/97/45/7c974512b36170f5444cd132756ba85f.jpg',
    },
    {
        id: 3,
        name: 'Oprah Winfrey',
        country: 'USA',
        review: 'It’s a game-changer. Absolutely loved it!',
        rating: 5,
        image: 'https://t.ctcdn.com.br/ghHviLxjyA6_ocejHAQq6al5gCY=/1024x576/smart/i332133.jpeg',
    },
    {
        id: 4,
        name: 'Cristiano Ronaldo',
        country: 'Portugal',
        review: 'A truly exceptional experience. Worth every bit of praise.',
        rating: 5,
        image: 'https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-6/240784102_403944054469080_940987349106364301_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=eY11zmCu93wQ7kNvgHhSarf&_nc_zt=23&_nc_ht=scontent.fhan14-4.fna&_nc_gid=A_ucJWlcBRRQWdGjweE0qxC&oh=00_AYAYGpeHNeJNNOAT4t9m1E0udGb5yZf2l7E6hjmucxzy-g&oe=67656989',
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
                    Tempora Facere Doloribus Id Aut. Ea Maiores Esse Accusantium Laboriosam. Quos Commodi Non Assumenda Quam Illum.
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
