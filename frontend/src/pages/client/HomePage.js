// File: src/pages/HomePage.js
import React from 'react';
import '../../assets/css/HomePage.css';

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
                    <form className="search-form">
                        <div className="row">
                            <div className="col-md-3">
                                <input type="text" className="form-control" placeholder="From" />
                            </div>
                            <div className="col-md-3">
                                <input type="text" className="form-control" placeholder="To" />
                            </div>
                            <div className="col-md-2">
                                <input type="date" className="form-control" placeholder="Departure" />
                            </div>
                            <div className="col-md-2">
                                <input type="date" className="form-control" placeholder="Return" />
                            </div>
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-primary">
                                    Search Flights
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
