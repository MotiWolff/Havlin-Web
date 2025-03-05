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

    // Process URL function
    function processUrl(url) {
        if (url.includes('dropbox.com')) {
            // Remove any existing parameters
            let cleanUrl = url.split('?')[0];
            // Replace www.dropbox.com with dl.dropboxusercontent.com
            cleanUrl = cleanUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
            // Add raw=1 parameter
            return cleanUrl + '?raw=1';
        }
        return url;
    }

    // מאזיני לחיצה לקטגוריות
    document.querySelectorAll('.category-item').forEach(category => {
        category.addEventListener('click', () => {
            const galleryType = category.dataset.gallery;
            console.log('Opening gallery:', galleryType);
            if (galleryData[galleryType] && galleryData[galleryType].length > 0) {
                console.log('Gallery data found:', galleryData[galleryType]);
                openGallery(galleryType);
            } else {
                console.log('No data found for gallery:', galleryType);
            }
        });
    });

    function openGallery(category) {
        document.body.classList.add('gallery-open');
        currentItems = galleryData[category];
        galleryTitle.textContent = document.querySelector(`[data-gallery="${category}"] span`).textContent;
        
        galleryGrid.innerHTML = currentItems.map((item, index) => {
            const processedUrl = processUrl(item.url);
            console.log('Processing item:', item);
            if (item.type === 'video') {
                return `
                    <div class="gallery-item" onclick="openModal(${index})">
                        <video>
                            <source src="${processedUrl}" type="video/mp4">
                            Your browser does not support the video tag.
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
                        <img src="${processedUrl}" alt="${item.title}">
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
        console.log('Opening modal for index:', index);
        currentIndex = index;
        updateModal();
        modal.style.display = 'block';
    }

    function updateModal() {
        const item = currentItems[currentIndex];
        const processedUrl = processUrl(item.url);
        console.log('Updating modal with item:', item);
        if (item.type === 'video') {
            modalContainer.innerHTML = `
                <video controls autoplay class="modal-media">
                    <source src="${processedUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
        } else {
            modalContainer.innerHTML = `
                <img class="modal-media" src="${processedUrl}" alt="${item.title}">`;
        }
        modalCaption.innerHTML = `<h4>${item.title}</h4><p>${item.description}</p>`;
        
        prevButton.style.display = item.type === 'video' ? 'none' : 'block';
        nextButton.style.display = item.type === 'video' ? 'none' : 'block';
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
        document.body.classList.remove('gallery-open');
        galleryView.classList.add('hidden');
    }

    document.getElementById('closeGalleryBtn').addEventListener('click', closeGallery);
}); 
