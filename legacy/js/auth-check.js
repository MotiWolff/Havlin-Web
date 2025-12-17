(function() {
    // בדיקה אם המשתמש מחובר
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isLoginPage = window.location.pathname === '/' || 
                       window.location.pathname === '/index.html';
    
    if (!isLoggedIn && !isLoginPage) {
        // אם לא מחובר ולא בדף ההתחברות, מעביר לדף ההתחברות
        window.location.replace('/');
    } else if (isLoggedIn && isLoginPage) {
        // אם מחובר ומנסה להגיע לדף ההתחברות, מעביר לדף הבית
        window.location.replace('/home.html');
    }
})(); 