// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Welcome button functionality
    const welcomeBtn = document.getElementById('welcomeBtn');
    if (welcomeBtn) {
        welcomeBtn.addEventListener('click', function() {
            alert('ברוכים הבאים למשפחת הבלין!');
        });
    }
  
    // Add fade-in animation to images
    const images = document.querySelectorAll('.image-gallery img');
    images.forEach(img => {
        img.classList.add('fade-in');
    });
  
    // Photo gallery functionality
    const gallery = document.getElementById('photoGallery');
    if (gallery) {
        // Sample gallery data
        const photos = [
            { src: 'https://ibb.co/vY1r8rr', caption: 'תמונה משפחתית 1' },
            { src: '/api/placeholder/300/200', caption: 'תמונה משפחתית 2' },
            { src: '/api/placeholder/300/200', caption: 'תמונה משפחתית 3' },
            { src: '/api/placeholder/300/200', caption: 'תמונה משפחתית 4' }
        ];
  
        // Create gallery items
        photos.forEach(photo => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';
  
            const item = document.createElement('div');
            item.className = 'gallery-item';
  
            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.caption;
            img.className = 'img-fluid';
  
            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.textContent = photo.caption;
  
            item.appendChild(img);
            item.appendChild(caption);
            col.appendChild(item);
            gallery.appendChild(col);
        });
    }
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const hebrewMonths = [
        'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר',
        'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'
    ];
  
    let currentMonthIndex = 0;
  
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
  
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;
            updateCalendar();
        });
  
        nextMonthBtn.addEventListener('click', () => {
            currentMonthIndex = (currentMonthIndex + 1) % 12;
            updateCalendar();
        });
  
        function updateCalendar() {
            currentMonthElement.textContent = `חודש ${hebrewMonths[currentMonthIndex]}`;
  
            // Clear existing calendar
            calendarGrid.innerHTML = '';
  
            // Create calendar grid
            for (let i = 1; i <= 30; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = i;
  
                // Add special event indicator if there's an event on this day
                if (hasEvent(currentMonthIndex, i)) {
                    dayElement.classList.add('has-event');
                    dayElement.addEventListener('click', () => {
                        alert(`אירוע מיוחד ב-${i} ${hebrewMonths[currentMonthIndex]}`);
                    });
                }
  
                calendarGrid.appendChild(dayElement);
            }
        }
  
        function hasEvent(month, day) {
            // Sample event data - can be expanded
            const events = {
                0: [1, 12, 15], // תשרי
                2: [3, 19],     // כסלו
                7: [25],        // אייר
                // Add more events as needed
            };
  
            return events[month]?.includes(day) || false;
        }
  
        // Initialize calendar
        updateCalendar();
    }
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const mainContent = document.querySelector('main');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    }

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close sidebar when clicking a link (especially useful on mobile)
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Theme Toggle
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.querySelector('i').classList.toggle('fa-sun');
        themeToggle.querySelector('i').classList.toggle('fa-moon');
    });

    // Page Loading Animation
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <svg class="loader-crown" viewbox="0 0 100 100">
            <path d="M10,70 L90,70 L80,30 L60,50 L50,20 L40,50 L20,30 Z" fill="#f0d78c"/>
        </svg>
    `;
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    });

    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrolled / maxScroll;
        progressBar.style.transform = `scaleX(${scrollPercent})`;
    });

    // Smooth Page Transitions
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (link.hostname === window.location.hostname) {
                e.preventDefault();
                const transitionDiv = document.createElement('div');
                transitionDiv.className = 'page-transition';
                document.body.appendChild(transitionDiv);

                setTimeout(() => {
                    window.location = link.href;
                }, 500);
            }
        });
    });

    // Search Functionality
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" class="search-input" placeholder="Search...">
    `;
    document.querySelector('.sidebar').insertBefore(
        searchContainer, 
        document.querySelector('.navbar-nav')
    );

    // Add smooth reveal for elements as they scroll into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .gallery-item, h2, h3').forEach(el => {
        observer.observe(el);
    });
  });
  