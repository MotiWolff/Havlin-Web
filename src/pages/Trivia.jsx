import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/trivia.css";

const Trivia = () => {
  return (
    <MainLayout>
      <section id="trivia-game" className="trivia-wrapper">
        <div className="trivia-header text-center mb-5">
          <div className="crown-logo mb-3">
            <i className="fas fa-crown fa-3x"></i>
          </div>
          <h1 className="trivia-title">משחק טריוויה משפחתי</h1>
          <p className="trivia-subtitle">
            בואו לבדוק כמה אתם מכירים את ממלכת הבלין
          </p>
        </div>

        <div className="trivia-hero-card fade-in">
          <div className="trivia-left">
            <h3>איך מצטרפים?</h3>
            <ol className="trivia-steps">
              <li>פותחים את מצלמת הטלפון או אפליקציית סריקת QR.</li>
              <li>מכוונים אל הקוד משמאל.</li>
              <li>או לוחצים על הכפתור כדי להצטרף ישירות.</li>
            </ol>

            <a
              href="https://kahoot.it/challenge/02316472?challenge-id=4decb033-ff4b-419a-bb3a-2d17a2f697ed_1735556275268"
              target="_blank"
              rel="noreferrer"
              className="btn-modern primary trivia-cta"
            >
              <i className="fas fa-gamepad ms-2"></i>
              הצטרפו למשחק
            </a>

            <p className="trivia-note">
              טיפ: מומלץ להתחבר ממסך גדול לצפייה בשאלות, ומהטלפון למענה.
            </p>
          </div>

          <div className="trivia-right">
            <div className="qr-glow">
              <div className="qr-container">
                <img
                  src="https://www.dropbox.com/scl/fi/078o94mc987qrhkovmxfs/assignment-qr-code.png?rlkey=iqz4s8l34zd5n2e7utsl8anz4&raw=1"
                  alt="QR Code for Kahoot"
                  className="qr-code"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/240x240?text=QR+Code+Missing";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Trivia;
