import React from 'react';
import '../../assets/css/Client/About.css';

import Our_story from '../../assets/images/client/our_story.jpg';

const About = () => {
    return (
        <div className="about-page">
            {/* Page Header */}
            <div class="about-header-section text-center p-3 my-3">
                <h1 class="about-display-4">About Us</h1>
                <p class="about-lead">
                    Empowering seamless travel experiences through innovation and reliability.
                </p>
            </div>

            {/* Our Story Section */}
            <div className="container about-story-section mb-5">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <img
                            src={Our_story}
                            alt="Our Story"
                            className="about-img-fluid rounded shadow"
                        />
                    </div>
                    <div className="col-md-6">
                        <h2>Our Story</h2>
                        <p>
                            Founded with a mission to revolutionize travel, Airline Reservation System
                            began as a dream to simplify the complexities of air travel. Over the years,
                            we’ve grown into a trusted platform connecting travelers with airlines worldwide.
                        </p>
                        <p>
                            With cutting-edge technology, we aim to make travel planning not only efficient
                            but also enjoyable, ensuring every journey starts on the right note.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Mission Section */}
            <div className="about-mission-section text-center py-5">
                <h2>Our Mission</h2>
                <p className="about-mt-3">
                    To provide a seamless, reliable, and user-friendly platform for booking flights,
                    connecting travelers to their destinations with ease and confidence.
                </p>
            </div>

            {/* Why Choose Us Section */}
            <div className="container about-choose-us-section py-5">
                <h2 className="text-center mb-4">Why Choose Us?</h2>
                <div className="row text-center">
                    <div className="col-md-4">
                        <div className="about-card shadow">
                            <div className="about-card-body">
                                <h4>Reliable Service</h4>
                                <p>
                                    Our platform ensures accurate and timely booking services, reducing the stress
                                    of travel planning.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="about-card shadow">
                            <div className="about-card-body">
                                <h4>Customer-Centric</h4>
                                <p>
                                    We prioritize your needs and strive to make every interaction meaningful
                                    and hassle-free.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="about-card shadow">
                            <div className="about-card-body">
                                <h4>Global Reach</h4>
                                <p>
                                    Partnered with leading airlines worldwide, we bring you a plethora of options
                                    for your travel plans.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Closing Section */}
            <div className="about-closing-section text-center my-5">
                <p className="about-lead">
                    At Airline Reservation System, we believe that every journey matters. Whether you're
                    traveling for business or leisure, we’re here to make your experience smooth and memorable.
                </p>
            </div>
        </div>
    );
};

export default About;