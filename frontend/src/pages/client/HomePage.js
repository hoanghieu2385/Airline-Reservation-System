// File: src/pages/HomePage.js
import React from 'react';
import '../../assets/css/HomePage.css';
import SearchForm from '../../components/client/SearchForm';
import img_why_choose_us from '../../assets/images/client/flights_homepage.png';
import TrendingDestinations from '../../components/client/TrendingDestinations';
import UserFeedback from '../../components/client/UserFeedback';

const HomePage = () => {
    return (
        <div>
            <section className="hero">
                <div className="hero-content text-center">
                    <h1>Embark On Your Journey To Secure The Ideal Getaway</h1>
                    <p>
                        Temporas Facere Doloribus Id Aut. Ea Maiores Esse Accusantium Laboriosam.
                        Quos Commodi Non Assumenda Quam Illum.
                    </p>

                    <SearchForm />
                </div>
            </section>

            <section className="why-choose-us">
                <div className="container">
                    <div className="why-choose-us-content">
                        {/* Image */}
                        <div className="why-choose-us-image">
                            <img src={img_why_choose_us} alt="Beautiful Destination" className='img_why_choose_us' />
                        </div>

                        {/* Text Content */}
                        <div className="why-choose-us-text">
                            <h2 className="section-title">Why Choose Us</h2>
                            <p className="section-subtitle">
                                Temporas Facere Doloribus Id Aut. Ea Maiores Esse Accusantium Laboriosam. Quos Commodi Non Assumenda Quam Illum.
                            </p>
                            <ul className="features-list">
                                <li>Assumenda Nobis Sit Deserunt Dolorem Repudiandae Occaecati Quisquam.</li>
                                <li>Beatae Aut Beatae Sed Aliquid Et Accusamus Vel.</li>
                                <li>Dolores Qui Nihil Quaerat Ducimus Fugit Aut Praesentium.</li>
                                <li>Necessitatibus Ut Culpa Molestias Deleniti Porro Maxime Enim Sed Vel.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <TrendingDestinations />
            </section>

            <section>
                <UserFeedback />
            </section>
        </div>
    );
};

export default HomePage;
