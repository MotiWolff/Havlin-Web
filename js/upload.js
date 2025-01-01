document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = e.target.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>מעלה...';
            
            const mediaUrl = document.getElementById('mediaUrl').value;
            const title = document.getElementById('mediaTitle').value;
            const description = document.getElementById('mediaDescription').value;
            const category = document.getElementById('mediaCategory').value;
            
            // זיהוי אם זה סרטון או תמונה לפי הסיומת
            const type = mediaUrl.toLowerCase().includes('.mp4') ? 'video' : 'image';
            
            // המרת הקישור לפורמט הנכון
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
                
                alert('הפריט הועלה בהצלחה!');
                e.target.reset();
                location.reload();
                
            } catch (error) {
                console.error('Error details:', error);
                alert(`אירעה שגיאה בהעלאה: ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-upload me-2"></i>העלה';
            }
        });
    }
}); 