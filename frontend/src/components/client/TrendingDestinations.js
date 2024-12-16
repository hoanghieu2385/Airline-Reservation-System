import React from 'react';
import '../../assets/css/TrendingDestinations.css';
import img_jakarta from '../../assets/images/client/img_jakarta.jpg';
import img_dubai from '../../assets/images/client/img_dubai.jpg';
import img_london from '../../assets/images/client/img_london.jpg';



const TrendingDestinations = () => {
    return (
        <section className="trending-destinations py-5">
            <div className="container text-center">
                <h2 className="section-title mb-4">Trending <span className="highlight">Destination</span> Now Days</h2>
                <p className="section-subtitle mb-5">
                    Tempora Facere Doloribus Id Aut. Ea Maiores Esse Accusantium Laboriosam. Quos Commodi Non Assumenda Quam Illum.
                </p>

                <div className="row g-4">
                    {/* Jakarta */}
                    <div className="col-md-4">
                        <div className="destination-card">
                            <img 
                                src={img_jakarta}
                                alt="Jakarta" 
                                className="img-fluid rounded"
                            />
                            <h5 className="mt-3">Jakarta</h5>
                        </div>
                    </div>

                    {/* Dubai */}
                    <div className="col-md-4">
                        <div className="destination-card">
                            <img 
                                src={img_dubai}
                                alt="Dubai" 
                                className="img-fluid rounded"
                            />
                            <h5 className="mt-3">Dubai</h5>
                        </div>
                    </div>

                    {/* London */}
                    <div className="col-md-4">
                        <div className="destination-card">
                            <img 
                                src={img_london}
                                alt="London" 
                                className="img-fluid rounded"
                            />
                            <h5 className="mt-3">London</h5>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendingDestinations;
