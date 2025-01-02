// src/components/common/Footer.js
import React from 'react';
import '../../assets/css/Client/Footer.css'

const Footer = () => {
    return (
        <footer className="custom-footer bg-light text-dark py-5 mt-4">
            <div className="container">
                <div className="row">
                    {/* Contact Section */}
                    <div className="col-md-4 mb-4">
                        <h5 className="custom-footer-heading">Contact Us</h5>
                        <p>Email: support@flightreservation.com</p>
                        <p>Hotline: +1 123 456 789</p>
                        <p>Address: 8A, Tôn Thất Thuyết, Mỹ Đình 2, Hà Nội</p>
                    </div>

                    {/* Quick Links Section */}
                    <div className="col-md-2 mb-4">
                        <h5 className="custom-footer-heading">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/about" className="text-dark text-decoration-none">About Us</a></li>
                            <li><a href="/faqs" className="text-dark text-decoration-none">FAQ</a></li>
                            <li><a href="/contact" className="text-dark text-decoration-none">Contact</a></li>
                            <li><a href="/terms" className="text-dark text-decoration-none">Terms & Conditions</a></li>
                            <li><a href="/RefundPolicies" className="text-dark text-decoration-none">Refund Policies</a></li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div className="col-md-3 mb-4 text-center">
                        <h5 className="custom-footer-heading">Follow Us</h5>
                        <div className="custom-footer-social-icons">
                            <a href="#" className="me-3 text-dark"><i className="fab fa-facebook"></i></a>
                            <a href="#" className="me-3 text-dark"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="me-3 text-dark"><i className="fab fa-linkedin"></i></a>
                            <a href="#" className="text-dark"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>

                    {/* Copyright Section */}
                    <div className="col-md-3 mb-4 text-end">
                        <h5 className="custom-footer-heading">Copyright</h5>
                        <p>&copy; 2024 Flight Reservation. All rights reserved.</p>
                        <p>Developed by <a href="/" className="text-dark text-decoration-none">ARS</a>.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;