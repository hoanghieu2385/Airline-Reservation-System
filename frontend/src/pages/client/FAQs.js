// src/components/pages/FAQ.js
import React from 'react';
import '../../assets/css/Client/FAQs.css'

const FAQ = () => {
    return (
        <div className="custom-faq-page bg-light py-5">
            <div className="container">
                <h1 className="custom-faq-heading text-center mb-4">Frequently Asked Questions</h1>
                <div className="accordion" id="customFaqAccordion">
                    
                    {/* Question 1 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="faqHeadingOne">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseOne"
                                aria-expanded="false"
                                aria-controls="faqCollapseOne"
                            >
                                How do I search for flights?
                            </button>
                        </h2>
                        <div
                            id="faqCollapseOne"
                            className="accordion-collapse collapse"
                            aria-labelledby="faqHeadingOne"
                            data-bs-parent="#customFaqAccordion"
                        >
                            <div className="accordion-body">
                                To search for flights, you need to:
                                <ul>
                                    <li>Choose your departure and arrival airports.</li>
                                    <li>Select your travel date, the number of passengers, and the class of travel (e.g., economy, business).</li>
                                    <li>Click "Search" to view available flights.</li>
                                </ul>
                                You can further filter the results by airline, price, or flight duration to find the best option for you.
                            </div>
                        </div>
                    </div>

                    {/* Question 2 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="faqHeadingTwo">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseTwo"
                                aria-expanded="false"
                                aria-controls="faqCollapseTwo"
                            >
                                Do I need to log in to book tickets?
                            </button>
                        </h2>
                        <div
                            id="faqCollapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="faqHeadingTwo"
                            data-bs-parent="#customFaqAccordion"
                        >
                            <div className="accordion-body">
                                Yes, logging in is required to book tickets. This ensures:
                                <ul>
                                    <li>A personalized and secure booking process.</li>
                                    <li>The ability to save your booking details for future reference.</li>
                                    <li>Access to your booking history and the option to manage or cancel bookings.</li>
                                </ul>
                                If you don’t have an account, you can create one during the booking process.
                            </div>
                        </div>
                    </div>

                    {/* Question 3 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="faqHeadingThree">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseThree"
                                aria-expanded="false"
                                aria-controls="faqCollapseThree"
                            >
                                What happens if I don't confirm the booking immediately?
                            </button>
                        </h2>
                        <div
                            id="faqCollapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="faqHeadingThree"
                            data-bs-parent="#customFaqAccordion"
                        >
                            <div className="accordion-body">
                                If you don’t confirm your booking immediately:
                                <ul>
                                    <li>Your selected tickets will be held temporarily for a specific duration (depending on the airline).</li>
                                    <li>If the hold time expires, the tickets will be released for others to book.</li>
                                    <li>You can still search for the same flights, but availability is not guaranteed.</li>
                                </ul>
                                It is recommended to confirm and pay for your booking as soon as possible to secure your seats.
                            </div>
                        </div>
                    </div>

                    {/* Question 4 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="faqHeadingFour">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseFour"
                                aria-expanded="false"
                                aria-controls="faqCollapseFour"
                            >
                                How can I contact support?
                            </button>
                        </h2>
                        <div
                            id="faqCollapseFour"
                            className="accordion-collapse collapse"
                            aria-labelledby="faqHeadingFour"
                            data-bs-parent="#customFaqAccordion"
                        >
                            <div className="accordion-body">
                                Our support team is available 24/7 to assist you. You can contact us via:
                                <ul>
                                    <li>Email: <a href="mailto:support@flightreservation.com">support@flightreservation.com</a></li>
                                    <li>Phone: <strong>+1 123 456 789</strong></li>
                                    <li>Live Chat: Accessible through our website during business hours.</li>
                                </ul>
                                Feel free to reach out for any queries related to booking, payment, or flight details.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
