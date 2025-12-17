import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/homepage.css';

const Home = () => {
  return (
    <MainLayout>
        {/* Full Screen Hero with Parallax-like effect */}
        <section className="modern-hero">
            <div className="hero-bg-pattern"></div>
            <div className="hero-content-wrapper">
                <div className="crown-badge animate__animated animate__fadeInDown">
                    <i className="fas fa-crown"></i>
                </div>
                <h1 className="hero-title animate__animated animate__fadeInUp">
                    ממלכת <span className="text-gold">הבלין</span>
                </h1>
                <p className="hero-subtitle animate__animated animate__fadeInUp animate__delay-1s">
                    המורשת. המשפחה. העתיד.
                </p>
                <div className="hero-actions animate__animated animate__fadeInUp animate__delay-1s">
                    <Link to="/family" className="btn-modern primary">
                        המשפחה שלנו <i className="fas fa-arrow-left"></i>
                    </Link>
                    <Link to="/gallery" className="btn-modern outline">
                        לגלריה <i className="fas fa-images"></i>
                    </Link>
                </div>
            </div>
            
            <div className="scroll-indicator">
                <span>גלו עוד</span>
                <i className="fas fa-chevron-down"></i>
            </div>
        </section>

        {/* Quick Access Grid */}
        <section className="quick-access container">
            <div className="section-header text-center">
                <h2>מה חדש בממלכה?</h2>
                <div className="separator"></div>
            </div>

            <div className="grid-cards">
                <Link to="/about" className="card-modern">
                    <div className="card-icon">
                        <i className="fas fa-history"></i>
                    </div>
                    <div className="card-info">
                        <h3>ההיסטוריה שלנו</h3>
                        <p>מסע בזמן מקמניץ ועד ליובאוויטש</p>
                    </div>
                    <div className="card-arrow">
                        <i className="fas fa-arrow-left"></i>
                    </div>
                </Link>

                <Link to="/calendar" className="card-modern">
                    <div className="card-icon">
                        <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div className="card-info">
                        <h3>חגיגות קרובות</h3>
                        <p>ימי הולדת, ימי נישואין ואירועים</p>
                    </div>
                    <div className="card-arrow">
                        <i className="fas fa-arrow-left"></i>
                    </div>
                </Link>

                <Link to="/trivia" className="card-modern">
                    <div className="card-icon">
                        <i className="fas fa-gamepad"></i>
                    </div>
                    <div className="card-info">
                        <h3>זמן משחק</h3>
                        <p>חושבים שאתם מכירים את המשפחה?</p>
                    </div>
                    <div className="card-arrow">
                        <i className="fas fa-arrow-left"></i>
                    </div>
                </Link>
            </div>
        </section>

        {/* Quote Banner */}
        <section className="quote-banner">
            <div className="container">
                <blockquote>
                    "מסורת משפחתית היא לא רק זיכרונות העבר, אלא גם המורשת שאנו בונים היום"
                </blockquote>
            </div>
        </section>
    </MainLayout>
  );
};

export default Home;
