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
    let preloadedImages = new Map();

    // Enhanced URL processing with proxy handling
    function processUrl(url) {
        if (!url) return url;

        // Remove any existing parameters first
        let cleanUrl = url.split('?')[0];

        if (url.includes('dropbox.com')) {
            // Use our proxy function for Dropbox URLs
            return `/.netlify/functions/proxy-media?url=${encodeURIComponent(url)}`;
        }

        return cleanUrl;
    }

    // Enhanced image preloading
    function preloadImage(url) {
        return new Promise((resolve, reject) => {
            if (preloadedImages.has(url)) {
                resolve(preloadedImages.get(url));
                return;
            }

            const img = new Image();
            
            img.onload = () => {
                preloadedImages.set(url, img);
                resolve(img);
            };
            
            img.onerror = (error) => {
                console.error('Image load error:', error);
                reject(new Error('Failed to load image'));
            };
            
            img.src = url;
        });
    }

    // Preload adjacent images
    function preloadAdjacentImages() {
        if (!currentItems.length) return;

        const nextIndex = (currentIndex + 1) % currentItems.length;
        const prevIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;

        if (currentItems[nextIndex]?.type === 'image') {
            preloadImage(processUrl(currentItems[nextIndex].url));
        }
        if (currentItems[prevIndex]?.type === 'image') {
            preloadImage(processUrl(currentItems[prevIndex].url));
        }
    }

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
        document.body.classList.add('gallery-open');
        currentItems = galleryData[category];
        galleryTitle.textContent = document.querySelector(`[data-gallery="${category}"] span`).textContent;
        
        galleryGrid.innerHTML = currentItems.map((item, index) => {
            const processedUrl = processUrl(item.url);
            if (item.type === 'video') {
                return `
                    <div class="gallery-item" onclick="openModal(${index})">
                        <div class="media-wrapper loading">
                            <video preload="metadata">
                                <source src="${processedUrl}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <div class="loading-spinner">
                                <i class="fas fa-spinner fa-spin"></i>
                            </div>
                            <div class="play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="item-caption">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>`;
            } else {
                return `
                    <div class="gallery-item" onclick="openModal(${index})">
                        <div class="media-wrapper loading">
                            <img src="${processedUrl}" 
                                 alt="${item.title}" 
                                 loading="lazy"
                                 onload="this.parentElement.classList.remove('loading')"
                                 onerror="handleImageError(this)"
                                 data-original-url="${item.url}">
                            <div class="loading-spinner">
                                <i class="fas fa-spinner fa-spin"></i>
                            </div>
                        </div>
                        <div class="item-caption">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>`;
            }
        }).join('');

        // Enhanced video error handling
        galleryGrid.querySelectorAll('video').forEach(video => {
            video.addEventListener('loadeddata', () => {
                video.parentElement.classList.remove('loading');
            });
            video.addEventListener('error', (e) => {
                console.error('Video load error:', e);
                video.parentElement.classList.add('error');
            });
        });
        
        galleryView.classList.remove('hidden');
    }

    // Global error handler for images
    window.handleImageError = function(img) {
        console.error('Image load error:', img.src);
        const wrapper = img.parentElement;
        wrapper.classList.add('error');
        
        // Try alternative URL format if not already using proxy
        if (!img.dataset.retried && !img.src.includes('/.netlify/functions/proxy-media')) {
            img.dataset.retried = 'true';
            const originalUrl = img.dataset.originalUrl;
            if (originalUrl) {
                img.src = processUrl(originalUrl);
            }
        }
    };

    // Enhanced modal opening
    window.openModal = async function(index) {
        currentIndex = index;
        modal.style.display = 'block';
        await updateModal();
        preloadAdjacentImages();
    }

    // Enhanced modal update
    async function updateModal() {
        const item = currentItems[currentIndex];
        const processedUrl = processUrl(item.url);
        modalContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';

        try {
            if (item.type === 'video') {
                modalContainer.innerHTML = `
                    <video controls autoplay class="modal-media">
                        <source src="${processedUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;

                const video = modalContainer.querySelector('video');
                await new Promise((resolve, reject) => {
                    video.addEventListener('loadeddata', resolve);
                    video.addEventListener('error', reject);
                });
            } else {
                await preloadImage(processedUrl);
                modalContainer.innerHTML = `
                    <img class="modal-media" 
                         src="${processedUrl}" 
                         alt="${item.title}">`;
            }
        } catch (error) {
            console.error('Modal media load error:', error);
            modalContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load media</p>
                    <button class="btn btn-outline-warning mt-2" onclick="retryLoadMedia(${currentIndex})">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>`;
        }

        modalCaption.innerHTML = `<h4>${item.title}</h4><p>${item.description}</p>`;
        prevButton.style.display = item.type === 'video' ? 'none' : 'block';
        nextButton.style.display = item.type === 'video' ? 'none' : 'block';
    }

    // Add retry functionality
    window.retryLoadMedia = function(index) {
        if (index === currentIndex) {
            updateModal();
        }
    };

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.style.display || modal.style.display === 'none') return;

        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                if (currentItems[currentIndex].type !== 'video') {
                    navigateGallery('prev');
                }
                break;
            case 'ArrowRight':
                if (currentItems[currentIndex].type !== 'video') {
                    navigateGallery('next');
                }
                break;
        }
    });

    function navigateGallery(direction) {
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % currentItems.length;
        } else {
            currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
        }
        updateModal();
        preloadAdjacentImages();
    }

    function closeModal() {
        modal.style.display = 'none';
        const video = modalContainer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }

    modalClose.onclick = closeModal;
    prevButton.onclick = () => navigateGallery('prev');
    nextButton.onclick = () => navigateGallery('next');

    window.closeGallery = function() {
        document.body.classList.remove('gallery-open');
        galleryView.classList.add('hidden');
    }

    document.getElementById('closeGalleryBtn').addEventListener('click', closeGallery);
}); 
