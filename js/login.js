document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const errorMessage = document.getElementById('error-message');
        const correctPassword = 'c5012';

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;

            if (password === correctPassword) {
                // שמירת מצב התחברות
                localStorage.setItem('isLoggedIn', 'true');
                // הפניה לדף הבית
                window.location.replace('/home.html');
            } else {
                // הצגת שגיאה
                errorMessage.textContent = 'קוד שגוי. נסה שוב.';
                errorMessage.style.display = 'block';
            }
        });
    }
}); 