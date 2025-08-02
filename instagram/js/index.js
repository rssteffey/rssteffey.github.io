// Simple custom lazy loading implementation
function loadVisibleImages() {
    const images = document.querySelectorAll('.lazy-image');
    images.forEach(img => {
        const rect = img.getBoundingClientRect();
        const isVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

        if (isVisible && img.src === img.getAttribute('data-src')) {
            // console.log('Image already loaded:', img.getAttribute('data-src'));
        } else if (isVisible && img.src !== img.getAttribute('data-src')) {
            // Show loading spinner
            img.parentElement.classList.add('loading');
            img.src = img.getAttribute('data-src');
            img.onload = () => {
                console.log('Image loaded successfully:', img.getAttribute('data-src'));
                // Hide loading spinner
                img.parentElement.classList.remove('loading');
            };
            img.onerror = () => {
                console.error('Error loading image:', img.getAttribute('data-src'));
                img.src = 'img/placeholder.jpg';
                // Hide loading spinner
                img.parentElement.classList.remove('loading');
            };
        }
    });
}

// Load images on scroll and initial load
window.addEventListener('scroll', loadVisibleImages);
window.addEventListener('load', loadVisibleImages);
// Initial check
loadVisibleImages();
