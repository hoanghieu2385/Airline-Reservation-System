import React from 'react';
import '../../assets/css/Client/Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            {/* Page Header */}
            <div className="contact-header container text-center my-5">
                <h1 className="contact-title display-4">Contact Us</h1>
                <p className="contact-description lead">
                    We would love to hear from you! Feel free to reach out with any feedback or inquiries.
                </p>
            </div>

            {/* Contact Details and Map */}
            <div className="contact-details container mb-5">
                <div className="row align-items-center">
                    {/* Contact Information */}
                    <div className="col-md-6 contact-info">
                        <h2 className="contact-info-title">Contact Information</h2>
                        <p className="contact-info-item"><strong>Phone:</strong> +1 234 567 890</p>
                        <p className="contact-info-item"><strong>Email:</strong> contact@flightreservation.com</p>
                        <p className="contact-info-item"><strong>Address:</strong> 8A, Tôn Thất Thuyết, Mỹ Đình 2, Hà Nội</p>
                    </div>

                    {/* Google Map */}
                    <div className="col-md-6 contact-map-container">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0964842999624!2d105.77972177476917!3d21.028825087777278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab00954decbf%3A0xdb4ee23b49ad50c8!2zRlBUIEFwdGVjaCBIw6AgTuG7mWkgLSBI4buHIHRo4buRbmcgxJHDoG8gdOG6oW8gbOG6rXAgdHLDrG5oIHZpw6puIHF14buRYyB04bq_!5e0!3m2!1svi!2s!4v1735797787380!5m2!1svi!2s"
                            style={{ border: 0, width: '500px', height: '400px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="contact-map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;