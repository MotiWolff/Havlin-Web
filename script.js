document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // קוד לטיפול במוזיקה
    const musicBtn = document.querySelector('.music-btn');
    const backgroundMusic = document.getElementById('background-music');
    
    if (musicBtn && backgroundMusic) {
        let isPlaying = false;

        musicBtn.addEventListener('click', function() {
            if (isPlaying) {
                backgroundMusic.pause();
                musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                musicBtn.classList.add('muted');
            } else {
                backgroundMusic.play().catch(function(error) {
                    console.log("Error playing audio:", error);
                });
                musicBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
                musicBtn.classList.remove('muted');
            }
            isPlaying = !isPlaying;
        });
    }

    // קוד לטיפול בתפריט הנייד
    const menuBtn = document.querySelector('.menu-toggle');
    if (menuBtn) {
        const nav = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (nav) {
            menuBtn.addEventListener('click', function() {
                nav.classList.toggle('active');
                menuBtn.classList.toggle('active');
                if (overlay) {
                    overlay.classList.toggle('active');
                }
            });

            if (overlay) {
                overlay.addEventListener('click', function() {
                    nav.classList.remove('active');
                    menuBtn.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
        }
    }
});

// טיפול בכפתור התנתקות - מחוץ ל-DOMContentLoaded
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Logout clicked');
        localStorage.removeItem('isLoggedIn');
        window.location.replace('/');
    });
}


  