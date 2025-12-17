import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import galleryData from '../data/galleryData.json';
import '../styles/gallery.css';
import UploadForm from '../components/UploadForm';

const Gallery = () => {
  const defaultCategory = 'family-events';
  const hasDefault =
    galleryData[defaultCategory] && galleryData[defaultCategory].length > 0;

  const [activeCategory, setActiveCategory] = useState(
    hasDefault ? defaultCategory : null
  );
  const [currentItems, setCurrentItems] = useState(
    hasDefault ? galleryData[defaultCategory] : []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categoryTitles = {
    'family-events': 'אירועים משפחתיים',
    'historical': 'תמונות היסטוריות',
    'weddings': 'חתונות',
    'misc': 'שונות',
    'family-videos': 'סרטונים משפחתיים'
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleCategoryClick = (category) => {
    if (galleryData[category] && galleryData[category].length > 0) {
        setActiveCategory(category);
        setCurrentItems(galleryData[category]);
    } else {
        // Still allow opening if empty? No, original had logic.
        // Original: if (galleryData[galleryType] && galleryData[galleryType].length > 0)
        // If empty, maybe show alert or just nothing.
        // I'll show alert if empty.
        alert("אין תמונות בקטגוריה זו עדיין");
    }
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
     setCurrentIndex((prev) => (prev + 1) % currentItems.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length);
  };
  
  const currentItem = currentItems[currentIndex];

  return (
    <MainLayout>
        <section id="gallery" className="card fade-in">
            <div className="card-body">
                <h2 className="card-title text-center mb-4">
                    <i className="fas fa-images me-2"></i>
                    ארכיון משפחת הבלין
                </h2>

                {!activeCategory ? (
                    <div className="media-categories mb-4">
                        <div className="row">
                            {/* Photos Section */}
                            <div className="col-md-6 mb-4">
                                <div className="media-category-card">
                                    <h3 className="category-title">
                                        <i className="fas fa-images"></i>
                                        אלבומי תמונות
                                    </h3>
                                    <div className="category-grid" id="photo-categories">
                                        {['family-events', 'historical', 'weddings', 'misc'].map(cat => (
                                            <div key={cat} className="category-item" onClick={() => handleCategoryClick(cat)}>
                                                <i className={`fas ${cat === 'family-events' ? 'fa-photo-film' : cat === 'historical' ? 'fa-camera-retro' : cat === 'weddings' ? 'fa-ring' : 'fa-random'}`}></i>
                                                <span>{categoryTitles[cat]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Documents/Videos Section */}
                            <div className="col-md-6 mb-4">
                                <div className="media-category-card">
                                    <h3 className="category-title">
                                        <i className="fas fa-file"></i>
                                        חוברות, קבצים ותיעודים
                                    </h3>
                                    <div className="category-grid">
                                        <a href="https://drive.google.com/drive/folders/1UagYzlXKQ6M5hlZmnSxXn4QTbs4TpshY?usp=drive_link" target="_blank" rel="noreferrer" className="category-item direct-link">
                                            <i className="fas fa-book"></i>
                                            <span>תשורות</span>
                                        </a>
                                        <a href="https://drive.google.com/drive/folders/1S67KRneR65ACao_Pibv1J4UJUjdSNbEr?usp=drive_link" target="_blank" rel="noreferrer" className="category-item direct-link">
                                            <i className="fas fa-gift"></i>
                                            <span>ספרים לסבא</span>
                                        </a>
                                        <a href="https://drive.google.com/drive/folders/1-YY2ESiyYGPb6J2QkXfroLitzHdLoTar?usp=drive_link" target="_blank" rel="noreferrer" className="category-item direct-link">
                                            <i className="fas fa-microphone"></i>
                                            <span>ראיונות</span>
                                        </a>
                                        <div className="category-item" onClick={() => handleCategoryClick('family-videos')}>
                                            <i className="fas fa-play-circle"></i>
                                            <span>סרטים משפחתיים</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Gallery View */
                    <div id="gallery-view" className="gallery-fullscreen">
                        <div className="gallery-header">
                            <h3 id="gallery-title" className="text-center">{categoryTitles[activeCategory]}</h3>
                            <button className="close-gallery" onClick={() => setActiveCategory(null)}>
                                <i className="fas fa-arrow-right"></i>
                                <span>חזרה לקטגוריות</span>
                            </button>
                        </div>
                        
                        <div className="gallery-grid">
                            {currentItems.map((item, index) => (
                                <div key={index} className="gallery-item" onClick={() => openModal(index)}>
                                    {item.type === 'video' ? (
                                        <>
                                            <video>
                                                <source src={item.url} type="video/mp4" />
                                            </video>
                                            <div className="play-overlay">
                                                <i className="fas fa-play"></i>
                                            </div>
                                        </>
                                    ) : (
                                        <img src={item.url} alt={item.title} />
                                    )}
                                    <div className="item-caption">
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal */}
                {modalOpen && currentItem && (
                    <div
                      id="galleryModal"
                      className="gallery-modal"
                      onClick={closeModal}
                    >
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                            <div className="modal-image-container">
                                {currentItem.type === 'video' ? (
                                    <video controls autoPlay className="modal-media">
                                        <source src={currentItem.url.replace('&dl=0', '&dl=1')} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img className="modal-media" src={currentItem.url} alt={currentItem.title} />
                                )}
                            </div>
                            <div className="modal-caption">
                                <h4>{currentItem.title}</h4>
                                <p>{currentItem.description}</p>
                            </div>
                            {currentItem.type !== 'video' && (
                                <>
                                    <button className="modal-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <button className="modal-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>

        <UploadForm />
    </MainLayout>
  );
};

export default Gallery;

