import React from 'react';
import MainLayout from '../layouts/MainLayout';
import '../styles/about.css';

const About = () => {
  return (
    <MainLayout>
        <div className="container">
             <div className="page-header text-center mb-5">
                <h1 className="display-4 text-gold mb-3">ההיסטוריה שלנו</h1>
                <p className="lead text-muted">מסע בזמן: מקמניץ ועד ליובאוויטש</p>
            </div>

            <div className="timeline-simple">
                <div className="timeline-simple-item">
                    <div className="timeline-simple-badge">
                        <span>תרל״ז</span>
                    </div>
                    <div className="timeline-simple-card">
                        <div className="icon-box"><i className="fas fa-star"></i></div>
                        <h3>הרב שלמה זלמן</h3>
                        <p className="lead">תחילת השושלת</p>
                        <p>הרב שלמה זלמן הבלין היה מחסידי אדמו״ר הרש״ב מליובאוויטש. בשנת תרע״א (1911) עלה לארץ ישראל בשליחות הרבי והיה מראשוני החסידים בירושלים.</p>
                    </div>
                </div>

                <div className="timeline-simple-item">
                    <div className="timeline-simple-badge">
                        <span>תשמ״ח</span>
                    </div>
                    <div className="timeline-simple-card">
                        <div className="icon-box"><i className="fas fa-book-reader"></i></div>
                        <h3>הרב יוסף יצחק הבלין</h3>
                        <p className="lead">ממשיך הדרך</p>
                        <p>ראש מכון היכל מנחם בירושלים ומחשובי רבני חב״ד. הקים את המכון, מנהל את סמינר שושנת ירושלים, וערך ספרי חסידות רבים.</p>
                        <ul className="timeline-list">
                            <li><i className="fas fa-check"></i> הקמת היכל מנחם</li>
                            <li><i className="fas fa-check"></i> ניהול סמינר שושנת ירושלים</li>
                            <li><i className="fas fa-check"></i> הקמת 770 רמת שלמה</li>
                        </ul>
                    </div>
                </div>

                <div className="timeline-simple-item">
                    <div className="timeline-simple-badge">
                        <span>היום</span>
                    </div>
                    <div className="timeline-simple-card">
                        <div className="icon-box"><i className="fas fa-users"></i></div>
                        <h3>הדור הבא</h3>
                        <p className="lead">ממשיכים את המסורת</p>
                        <p>משפחת הבלין ממשיכה להפיץ את המעיינות בכל רחבי העולם. שליחות, חינוך, הפצת יהדות והקמת בתים חסידיים.</p>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
  );
};
export default About;
