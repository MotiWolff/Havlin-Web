import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
    setMusicPlaying(!musicPlaying);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    fetch('/.netlify/functions/logout', { method: 'POST', credentials: 'include' })
      .catch(() => {})
      .finally(() => navigate('/'));
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="app-wrapper">
      {/* Audio Player */}
      <audio ref={audioRef} id="background-music" loop>
        <source src="https://www.dropbox.com/scl/fi/l46x0rdb562ynt06odmqw/niggun.mp3?rlkey=yx7hgfa9fyllrmpc4i7892n8v&dl=1" type="audio/mpeg" />
      </audio>

      {/* Modern Top Navbar */}
      <nav className={`navbar-modern ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/home" className="nav-brand" onClick={closeMobileMenu}>
             <i className="fas fa-crown"></i>
             <span>משפחת הבלין</span>
          </Link>

          {/* Desktop Menu */}
          <div className="nav-links desktop-only">
            <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
              דף הבית
            </Link>
            <Link to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
              היסטוריה
            </Link>
            <Link to="/family" className={`nav-item ${location.pathname === '/family' ? 'active' : ''}`}>
              משפחה
            </Link>
            <Link to="/gallery" className={`nav-item ${location.pathname === '/gallery' ? 'active' : ''}`}>
              גלריה
            </Link>
            <Link to="/calendar" className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}>
              לוח שנה
            </Link>
            <Link to="/trivia" className={`nav-item ${location.pathname === '/trivia' ? 'active' : ''}`}>
              טריוויה
            </Link>
            <button className="nav-item logout" onClick={handleLogout}>
              יציאה <i className="fas fa-sign-out-alt me-1"></i>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className={`mobile-toggle ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
            <Link to="/home" onClick={closeMobileMenu}>דף הבית</Link>
            <Link to="/about" onClick={closeMobileMenu}>היסטוריה</Link>
            <Link to="/family" onClick={closeMobileMenu}>משפחה</Link>
            <Link to="/gallery" onClick={closeMobileMenu}>גלריה</Link>
            <Link to="/calendar" onClick={closeMobileMenu}>לוח שנה</Link>
            <Link to="/trivia" onClick={closeMobileMenu}>טריוויה</Link>
            <button onClick={(e) => { closeMobileMenu(); handleLogout(e); }} className="text-danger">יציאה</button>
        </div>
      </div>

      {/* Floating Music Control */}
      <div className="floating-music">
        <button className={`music-fab ${musicPlaying ? 'playing' : ''}`} onClick={toggleMusic} title="נגן/עצור מוזיקה">
           <i className={`fas ${musicPlaying ? 'fa-pause' : 'fa-music'}`}></i>
           <span className="ripple"></span>
        </button>
      </div>

      {/* Main Content */}
      <main className="main-content">
          {children}
      </main>

      <footer className="modern-footer">
        <div className="container">
            <div className="footer-content">
                <div className="footer-brand">
                    <i className="fas fa-crown"></i>
                    <p>מורשת של תורה, חסידות ומסירות</p>
                </div>
                <div className="footer-info">
                    <p>© {new Date().getFullYear()} משפחת הבלין</p>
                    <p className="credit">נבנה באהבה ע"י מוטי וואלף</p>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
