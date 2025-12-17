import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { birthdays, specialEvents, anniversaries } from '../data/calendarData';
import '../styles/calendar.css';

const Calendar = () => {
  return (
    <MainLayout>
        <div className="calendar-page container">
            <div className="page-header text-center mb-5">
                <h1 className="display-4 text-gold mb-3">לוח השנה ההבליני</h1>
                <p className="lead text-muted">חוגגים ביחד את הרגעים המיוחדים</p>
            </div>

            {/* Top Section: Special Events & Anniversaries */}
            <div className="calendar-hero">
                <div className="calendar-grid-visual">
                    {/* Special Events */}
                    <div className="event-box">
                        <div className="event-box-header">
                            <i className="fas fa-star"></i>
                            <h3>אירועים מיוחדים</h3>
                        </div>
                        <div className="event-list-modern">
                            {specialEvents.map((e, idx) => (
                              <div key={idx} className="event-item-modern">
                                <div className="event-icon">
                                  <i className={`fas ${e.icon}`}></i>
                                </div>
                                <div className="event-details">
                                    <span>{e.title}</span>
                                    <span className="event-date">{e.date}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                    </div>

                    {/* Anniversaries */}
                    <div className="event-box">
                        <div className="event-box-header">
                            <i className="fas fa-glass-cheers"></i>
                            <h3>ימי נישואין</h3>
                        </div>
                        <div className="event-list-modern">
                            {anniversaries.map((a, idx) => (
                              <div key={idx} className="event-item-modern">
                                <div className="event-icon">
                                  <i className={`fas ${a.icon}`}></i>
                                </div>
                                <div className="event-details">
                                    <span>{a.couple}</span>
                                    <span className="event-date">{a.date}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Birthdays Grid */}
            <div className="birthdays-section">
                <h2 className="text-center mb-4 section-title">
                    <span className="border-bottom-gold pb-2">ימי הולדת</span>
                </h2>
                
                <div className="months-grid">
                    {Object.entries(birthdays).map(([month, events]) => {
                         const sortedEvents = [...events].sort((a, b) => a.day - b.day);
                         return (
                            <div key={month} className="month-card">
                                <div className="month-card-header">
                                    {month}
                                </div>
                                <div className="month-card-body">
                                    {sortedEvents.map((event, idx) => (
                                        <div key={idx} className="birthday-row">
                                            <div className="day-badge">{event.day}</div>
                                            <div className="person-name">{event.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
        </div>
    </MainLayout>
  );
};

export default Calendar;
