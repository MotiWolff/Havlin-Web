document.addEventListener('DOMContentLoaded', function() {
    const galleryView = document.getElementById('gallery-view');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryGrid = galleryView.querySelector('.gallery-grid');
    const modal = document.getElementById('galleryModal');
    const modalContainer = document.querySelector('.modal-image-container');
    const modalCaption = document.querySelector('.modal-caption');
    const modalClose = document.querySelector('.modal-close');
    const prevButton = document.querySelector('.modal-nav.prev');
    const nextButton = document.querySelector('.modal-nav.next');

    let currentItems = [];
    let currentIndex = 0;

    // מאזיני לחיצה לקטגוריות
    document.querySelectorAll('.category-item').forEach(category => {
        category.addEventListener('click', () => {
            const galleryType = category.dataset.gallery;
            if (galleryData[galleryType] && galleryData[galleryType].length > 0) {
                openGallery(galleryType);
            }
        });
    });

    function openGallery(category) {
        currentItems = galleryData[category];
        galleryTitle.textContent = document.querySelector(`[data-gallery="${category}"] span`).textContent;
        
        galleryGrid.innerHTML = currentItems.map((item, index) => {
            if (item.type === 'video') {
                return `
                    <div class="gallery-item" onclick="openModal(${index})">
                        <video>
                            <source src="${item.url}" type="video/mp4">
                        </video>
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="item-caption">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>`;
            } else {
                return `
                    <div class="gallery-item" onclick="openModal(${index})">
                        <img src="${item.url}" alt="${item.title}">
                        <div class="item-caption">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>`;
            }
        }).join('');
        
        galleryView.classList.remove('hidden');
    }

    window.openModal = function(index) {
        currentIndex = index;
        updateModal();
        modal.style.display = 'block';
    }

    function updateModal() {
        const item = currentItems[currentIndex];
        if (item.type === 'video') {
            modalContainer.innerHTML = `
                <video controls autoplay class="modal-media">
                    <source src="${item.url.replace('&dl=0', '&dl=1')}" type="video/mp4">
                </video>`;
        } else {
            modalContainer.innerHTML = `
                <img class="modal-media" src="${item.url}" alt="${item.title}">`;
        }
        modalCaption.innerHTML = `<h4>${item.title}</h4><p>${item.description}</p>`;
        
        // הצג/הסתר כפתורי ניווט בהתאם לסוג המדיה
        if (item.type === 'video') {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
        }
    }

    modalClose.onclick = function() {
        modal.style.display = 'none';
        // עצור וידאו אם מתנגן
        const video = modalContainer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }

    prevButton.onclick = function() {
        if (currentItems[currentIndex].type === 'image') {
            currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
            updateModal();
        }
    }

    nextButton.onclick = function() {
        if (currentItems[currentIndex].type === 'image') {
            currentIndex = (currentIndex + 1) % currentItems.length;
            updateModal();
        }
    }

    // הוספת מאזין למקש Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            const video = modal.querySelector('video');
            if (video) video.pause();
        }
    });

    // הוספת פונקציית closeGallery
    window.closeGallery = function() {
        galleryView.classList.add('hidden');
    }

    document.getElementById('closeGalleryBtn').addEventListener('click', function() {
        galleryView.classList.add('hidden');
    });
}); 