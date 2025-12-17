import React, { useState } from 'react';

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Using native form data
    const form = e.target;
    const mediaUrl = form.elements.mediaUrl.value;
    const title = form.elements.mediaTitle.value;
    const description = form.elements.mediaDescription.value;
    const category = form.elements.mediaCategory.value;
    
    const type = mediaUrl.toLowerCase().includes('.mp4') ? 'video' : 'image';
    const formattedUrl = mediaUrl.replace(/\?.*$/, '?dl=1');
    
    try {
        const response = await fetch('/.netlify/functions/add-media', {
            method: 'POST',
            body: JSON.stringify({
                type,
                url: formattedUrl,
                title,
                description,
                category
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.details || 'Failed to upload');
        }
        
        alert('הפריט הועלה בהצלחה! (יש לרענן את הדף לראות את השינוי לאחר בניה מחדש)');
        form.reset();
        
    } catch (error) {
        console.error('Error details:', error);
        alert(`אירעה שגיאה בהעלאה: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-section fade-in mt-4">
      <div className="upload-inner">
        <div className="upload-header text-center mb-4">
          <div className="upload-icon-circle">
            <i className="fas fa-upload"></i>
          </div>
          <h3 className="mb-1">הוספת תמונות וסרטונים</h3>
          <p className="text-muted small">
            מדביקים קישור מדרופבוקס, בוחרים קטגוריה – והפריט מצטרף לארכיון המשפחתי.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form text-end">
          <div className="form-group mb-3">
            <label htmlFor="mediaUrl">קישור לתמונה/סרטון (Dropbox)</label>
            <input
              type="url"
              className="form-control"
              name="mediaUrl"
              id="mediaUrl"
              required
              placeholder="https://www.dropbox.com/..."
            />
            <small className="form-text text-muted">
              חשוב: השתמשו בקישור שיתוף (Share link) מדרופבוקס.
            </small>
          </div>

          <div className="form-row-two">
            <div className="form-group mb-3">
              <label htmlFor="mediaTitle">כותרת</label>
              <input
                type="text"
                className="form-control"
                name="mediaTitle"
                id="mediaTitle"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mediaCategory">קטגוריה</label>
              <select
                className="form-control"
                name="mediaCategory"
                id="mediaCategory"
                required
              >
                <option value="family-events">אירועים משפחתיים</option>
                <option value="family-videos">סרטונים משפחתיים</option>
                <option value="historical">תמונות היסטוריות</option>
                <option value="weddings">חתונות</option>
                <option value="misc">שונות</option>
              </select>
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="mediaDescription">תיאור</label>
            <textarea
              className="form-control"
              name="mediaDescription"
              id="mediaDescription"
              rows="2"
            ></textarea>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn-modern primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>מעלה...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-2"></i>העלה
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;

