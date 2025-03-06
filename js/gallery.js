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
    let retryCount = new Map();
    const MAX_RETRIES = 3;

    // Function to get direct Dropbox URL
    function getDirectDropboxUrl(url) {
        if (url.includes('dropbox.com')) {
            // Convert to direct download URL
            let directUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
            
            // Handle special format URLs
            if (directUrl.includes('/scl/fi/')) {
                // This handles newer Dropbox sharing format
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/');
                // Extract the file ID and name
                const fileId = pathParts[pathParts.indexOf('scl') + 2];
                const fileName = pathParts[pathParts.length - 1];
                
                // Construct the raw content URL
                directUrl = `https://dl.dropboxusercontent.com/scl/fi/${fileId}/${fileName}`;
                
                // Add rlkey if present in original URL
                const params = new URLSearchParams(urlObj.search);
                const rlkey = params.get('rlkey');
                if (rlkey) {
                    directUrl += `?rlkey=${rlkey}`;
                }
            }
            
            // Add raw=1 parameter if not already present
            if (!directUrl.includes('raw=1')) {
                directUrl += directUrl.includes('?') ? '&raw=1' : '?raw=1';
            }
            
            return directUrl;
        }
        return url;
    }

    // Enhanced URL processing with direct URL handling and proxy fallback
    function processUrl(url) {
        if (!url) return url;

        // Remove any existing parameters first
        let cleanUrl = url.split('?')[0];

        if (url.includes('dropbox.com')) {
            try {
                // Try direct URL first
                return getDirectDropboxUrl(url);
            } catch (e) {
                console.warn('Error creating direct URL, falling back to proxy:', e);
                // Fall back to proxy if direct conversion fails
                return `/.netlify/functions/proxy-media?url=${encodeURIComponent(url)}&t=${Date.now()}`;
            }
        }

        return cleanUrl;
    }

    // Enhanced image preloading with retry logic
    async function preloadImage(url, retries = 0) {
        if (preloadedImages.has(url)) {
            return preloadedImages.get(url);
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            
            // Add a timeout to prevent hanging
            const timeout = setTimeout(() => {
                img.src = ''; // Cancel the current request
                reject(new Error('Image load timeout'));
            }, 30000); // 30 second timeout

            img.onload = () => {
                clearTimeout(timeout);
                preloadedImages.set(url, img);
                retryCount.delete(url);
                resolve(img);
            };

            img.onerror = async (error) => {
                clearTimeout(timeout);
                console.warn(`Image load error (attempt ${retries + 1}):`, url);
                
                const currentRetries = retryCount.get(url) || 0;
                if (currentRetries < MAX_RETRIES) {
                    retryCount.set(url, currentRetries + 1);
                    console.warn(`Retrying image load (${currentRetries + 1}/${MAX_RETRIES}):`, url);
                    
                    // Try alternate URL strategy on retry
                    setTimeout(async () => {
                        try {
                            let retryUrl = url;
                            
                            // If it's a Dropbox URL and we're not already using direct link
                            if (url.includes('dropbox.com') && !url.includes('raw=1')) {
                                retryUrl = getDirectDropboxUrl(url);
                            } 
                            // If not already using proxy, try that next
                            else if (!url.includes('/.netlify/functions/proxy-media')) {
                                const originalUrl = url.split('?')[0]; // Get clean URL
                                retryUrl = `/.netlify/functions/proxy-media?url=${encodeURIComponent(originalUrl)}&retry=${currentRetries + 1}`;
                            }
                            // Add cache buster
                            else {
                                retryUrl = `${url}&cb=${Date.now()}`;
                            }
                            
                            console.log(`Retry attempt with URL: ${retryUrl}`);
                            const result = await preloadImage(retryUrl, currentRetries + 1);
                            resolve(result);
                        } catch (retryError) {
                            reject(retryError);
                        }
                    }, 1000 * (currentRetries + 1)); // Exponential backoff
                } else {
                    retryCount.delete(url);
                    reject(new Error(`Failed to load image after ${MAX_RETRIES} attempts`));
                }
            };
            
            img.src = url;
        });
    }

    // Preload adjacent images
    async function preloadAdjacentImages() {
        if (!currentItems.length) return;

        const nextIndex = (currentIndex + 1) % currentItems.length;
        const prevIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;

        try {
            if (currentItems[nextIndex]?.type === 'image') {
                await preloadImage(processUrl(currentItems[nextIndex].url));
            }
            if (currentItems[prevIndex]?.type === 'image') {
                await preloadImage(processUrl(currentItems[prevIndex].url));
            }
        } catch (error) {
            console.warn('Failed to preload adjacent images:', error);
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
            }
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

    // Enhanced global error handler for images
    window.handleImageError = function(img) {
        console.error('Image load error:', img.src);
        const wrapper = img.parentElement;
        wrapper.classList.add('error');
        
        // Try alternative URL format if not already tried
        if (!img.dataset.retried) {
            img.dataset.retried = 'true';
            const originalUrl = img.dataset.originalUrl;
            
            if (originalUrl) {
                console.log('Retrying with alternate URL format');
                
                // Try direct Dropbox URL first
                if (originalUrl.includes('dropbox.com') && !img.src.includes('raw=1')) {
                    console.log('Trying direct Dropbox URL');
                    img.src = getDirectDropboxUrl(originalUrl);
                    return;
                }
                
                // Fall back to proxy if not already using it
                if (!img.src.includes('/.netlify/functions/proxy-media')) {
                    console.log('Falling back to proxy URL');
                    img.src = `/.netlify/functions/proxy-media?url=${encodeURIComponent(originalUrl)}&t=${Date.now()}`;
                    return;
                }
                
                // Add cache buster if all else failed
                if (img.src.includes('/.netlify/functions/proxy-media')) {
                    console.log('Adding cache buster to proxy URL');
                    img.src = `${img.src}&cb=${Date.now()}`;
                    return;
                }
            }
        }
        
        // If all retries fail, show error placeholder
        if (img.dataset.retried === 'true') {
            wrapper.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load image</p>
                    <button class="btn btn-sm btn-outline-warning mt-2" onclick="retryImage(this, '${encodeURIComponent(img.dataset.originalUrl)}')">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    };
    
    // Add global retry function
    window.retryImage = function(button, encodedUrl) {
        const url = decodeURIComponent(encodedUrl);
        const wrapper = button.closest('.media-wrapper');
        
        // Reset wrapper to loading state
        wrapper.classList.add('loading');
        wrapper.classList.remove('error');
        wrapper.innerHTML = `
            <img src="${getDirectDropboxUrl(url)}" 
                 alt="Retrying..." 
                 loading="lazy"
                 onload="this.parentElement.classList.remove('loading')"
                 onerror="handleImageError(this)"
                 data-original-url="${url}">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        `;
    };

    // Enhanced modal opening with error handling
    window.openModal = async function(index) {
        try {
            currentIndex = index;
            modal.style.display = 'block';
            await updateModal();
            preloadAdjacentImages().catch(console.warn);
        } catch (error) {
            console.error('Error opening modal:', error);
            modal.style.display = 'none';
            alert('Failed to open image. Please try again.');
        }
    }

    // Enhanced modal update with better error handling
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
                    // Add timeout to prevent hanging
                    setTimeout(() => reject(new Error('Video load timeout')), 30000);
                });
            } else {
                const img = await preloadImage(processedUrl);
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
        prevButton.style.display = currentItems.length > 1 ? 'block' : 'none';
        nextButton.style.display = currentItems.length > 1 ? 'block' : 'none';
    }

    // Add retry functionality
    window.retryLoadMedia = function(index) {
        if (index === currentIndex) {
            updateModal().catch(console.error);
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
                if (currentItems.length > 1) {
                    navigateGallery('prev');
                }
                break;
            case 'ArrowRight':
                if (currentItems.length > 1) {
                    navigateGallery('next');
                }
                break;
        }
    });

    async function navigateGallery(direction) {
        try {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % currentItems.length;
            } else {
                currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
            }
            await updateModal();
            preloadAdjacentImages().catch(console.warn);
        } catch (error) {
            console.error('Navigation error:', error);
        }
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