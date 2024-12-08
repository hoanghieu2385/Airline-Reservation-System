// src/pages/TermsAndConditions.js
import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="container mt-4 mb-4">
            <h1 className="text-primary mb-4">Terms and Conditions</h1>
            <p className="lead">Welcome to our booking platform. By using our service, you agree to the following terms:</p>

            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <h2 className="h5 text-secondary">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using our platform, you accept and agree to be bound by these terms. If you do not agree, please refrain from using our services.
                    </p>
                </div>
            </div>

            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <h2 className="h5 text-secondary">2. Booking and Payment</h2>
                    <p>
                        All bookings are subject to availability. Payments are processed securely through our partnered payment gateway.
                    </p>
                </div>
            </div>

            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <h2 className="h5 text-secondary">3. Cancellations and Refunds</h2>
                    <p>
                        Cancellation policies depend on the airline and fare type. Refunds, if applicable, will be processed according to the airline's policy.
                    </p>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="h5 text-secondary">4. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. It is your responsibility to review them regularly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
