import React from 'react';
import '../../assets/css/Policies.css';

const Policies = () => {
    return (
        <div className="policies-container">
            <div className="policies-card">
                {/* Section 1 */}
                <section className="policies-section">
                    <h3 className="policies-title">Cookies and Navigation Settings</h3>
                    <ul className="policies-list">
                        <li>Display relevant navigation settings;</li>
                        <li>Remember visitor preferences;</li>
                        <li>Enhance user experience;</li>
                        <li>Limit the number of displayed advertisements.</li>
                    </ul>
                    <p className="policies-paragraph">
                        By clicking Agree when the cookie notification is displayed, you consent to cookies being set and read on the website www.vietnamairlines.com and its linked subdomains.
                    </p>
                    <h4 className="policies-subtitle">How does Vietnam Airlines use cookies?</h4>
                    <ul className="policies-list">
                        <li>Essential cookies</li>
                        <li>Functional cookies</li>
                        <li>Performance and analytics cookies</li>
                        <li>Personalization cookies</li>
                        <li>Marketing and advertising cookies</li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="policies-section">
                    <h3 className="policies-title">Criteria and Conditions for Using the Online Ticketing System</h3>
                    <p className="policies-paragraph">
                        The conditions below apply specifically to the online ticketing functionality on the Website and Mobile Application. By using this functionality to book, purchase tickets, and additional products, you implicitly agree to comply with all instructions, terms, conditions, and notices posted on the Website and Mobile Application.
                    </p>
                    <p className="policies-paragraph">
                        If you do not intend to purchase tickets online or disagree with any terms or conditions stated, PLEASE STOP USING this functionality.
                    </p>
                    <h4 className="policies-subtitle">Conditions for Using the Online Ticketing Feature</h4>
                    <ul className="policies-list">
                        <li>The online ticketing feature is for personal and non-commercial use only.</li>
                        <li>You must confirm and guarantee that you are of legal age to use this functionality.</li>
                    </ul>
                    <h4 className="policies-subtitle">Ticket Pricing and Fees</h4>
                    <p className="policies-paragraph">
                        The total payment amount includes all taxes and fees payable by passengers.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="policies-section">
                    <h3 className="policies-title">Data Information</h3>
                    <h4 className="policies-subtitle">1. Basic Data</h4>
                    <ul className="policies-list">
                        <li>Name, passport number, and other identifying information.</li>
                        <li>Contact information and personal or registration account information.</li>
                        <li>Details about personal account numbers.</li>
                        <li>Payment information.</li>
                        <li>Information about reservations, bookings, and ticket purchases.</li>
                    </ul>
                    <h4 className="policies-subtitle">2. Sensitive Data</h4>
                    <p className="policies-paragraph">
                        Vietnam Airlines may collect certain information about your health condition.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Policies;
