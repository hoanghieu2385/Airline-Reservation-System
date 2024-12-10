// File: src/pages/HomePage.js
import React from 'react';
import '../../assets/css/HomePage.css';
import SearchForm from '../../components/client/SearchForm';

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
                    
                    <SearchForm />
                </div>
            </section>
        </div>
    );
};

export default HomePage;
