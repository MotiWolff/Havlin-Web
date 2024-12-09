// Login validation
window.validateLogin = function(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'c5012') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('סיסמה שגויה');
    }
    return false;
};

// Logout functionality
window.logout = function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
};

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    const isLoginPage = window.location.pathname.includes('login.html');
    
    // Only check login status if we're not on the login page
    if (!isLoginPage && !localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Audio functionality
    const audio = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const icon = musicToggle?.querySelector('i');

    musicToggle?.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            icon.className = 'fas fa-volume-up';
            musicToggle.classList.remove('muted');
        } else {
            audio.pause();
            icon.className = 'fas fa-volume-mute';
            musicToggle.classList.add('muted');
        }
    });

    // Sidebar functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    // Toggle sidebar
    menuToggle?.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close sidebar when clicking overlay
    overlay?.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
    });

    // Display birthdays if we're on the calendar page
    if (typeof displayBirthdays === 'function') {
        displayBirthdays();
    }
});
  