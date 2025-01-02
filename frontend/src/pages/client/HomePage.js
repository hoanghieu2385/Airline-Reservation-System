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
                    <p></p>

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
                            Discover destinations that turn dreams into memories.
                            </p>
                            <ul className="features-list">
                                <li>Experience seamless booking with our user-friendly platform.</li>
                                <li>Access exclusive deals and competitive prices.</li>
                                <li>Enjoy 24/7 dedicated customer support.</li>
                                <li>Book with confidence with our secure payment system.</li>
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
