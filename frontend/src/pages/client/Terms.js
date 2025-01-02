import React from 'react';
import '../../assets/css/Client/Terms.css';

const Terms = () => {
    return (
        <div className="terms-page">
            {/* Page Header */}
            <div className="terms-header text-center py-5">
                <h1 className="terms-title">Terms & Conditions</h1>
                <p className="terms-subtitle">
                    Please read these terms carefully. By using our services, you agree to them.
                </p>
            </div>

            {/* Terms Section */}
            <div className="container py-5">
                <div className="terms-section">
                    <h2 className="terms-section-title">1. General Terms</h2>
                    <p className="terms-text">
                        By accessing or using the Airline Reservation System, you agree to comply with 
                        and be bound by the following terms and conditions. If you do not agree, you may not 
                        use the service.
                    </p>
                </div>

                <div className="terms-section">
                    <h2 className="terms-section-title">2. Booking Policies</h2>
                    <p className="terms-text">
                        All flight bookings are subject to availability and confirmation by the airline. 
                        Prices and availability may change at any time before payment is completed.
                    </p>
                </div>

                <div className="terms-section">
                    <h2 className="terms-section-title">3. Payments</h2>
                    <p className="terms-text">
                        Payments for reservations must be made in full at the time of booking. We accept 
                        major credit cards and other payment methods as listed on our platform.
                    </p>
                </div>

                <div className="terms-section">
                    <h2 className="terms-section-title">4. Cancellations and Refunds</h2>
                    <p className="terms-text">
                        Cancellations and refunds are governed by the policies of the respective airlines. 
                        Please review the cancellation and refund terms carefully before booking.
                    </p>
                </div>

                <div className="terms-section">
                    <h2 className="terms-section-title">5. User Responsibilities</h2>
                    <p className="terms-text">
                        Users must ensure the accuracy of all information provided during the booking 
                        process. Any errors in details such as names or dates may result in additional charges 
                        or cancellation.
                    </p>
                </div>

                <div className="terms-section">
                    <h2 className="terms-section-title">6. Limitation of Liability</h2>
                    <p className="terms-text">
                        We are not responsible for any direct, indirect, or consequential losses arising from 
                        the use of our platform or services. Users are advised to verify all details before 
                        making reservations.
                    </p>
                </div>

                <div className="terms-section">
                    <h2 className="terms-section-title">7. Privacy Policy</h2>
                    <p className="terms-text">
                        By using our service, you consent to our Privacy Policy, which outlines how we 
                        collect, use, and protect your personal data.
                    </p>
                </div>

                <div className="terms-section">
                    <h2 className="terms-section-title">8. Changes to Terms</h2>
                    <p className="terms-text">
                        We reserve the right to update or modify these terms at any time without prior notice. 
                        Continued use of our platform after changes signifies your acceptance of the revised terms.
                    </p>
                </div>

                <div className="terms-footer text-center mt-5">
                    <p>
                        Have questions? Contact us at 
                        <a href="mailto:terms@flightreservation.com" className="terms-link"> terms@flightreservation.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;