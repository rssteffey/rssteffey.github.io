// Carousel functionality
const modal = document.getElementById('imageModal');
if (!modal) {
    console.error('Modal element not found!');
}

const modalImage = modal?.querySelector('.modal-image');
if (!modalImage) {
    console.error('Modal image container not found!');
}

const modalCaption = modal?.querySelector('.modal-caption');
if (!modalCaption) {
    console.error('Modal caption element not found!');
}

const modalComments = modal?.querySelector('.modal-comments');
if (!modalComments) {
    console.error('Modal comments element not found!');
}

const closeBtn = modal?.querySelector('.modal-close');
if (!closeBtn) {
    console.error('Modal close button not found!');
}

const prevBtn = modal?.querySelector('.modal-prev');
if (!prevBtn) {
    console.error('Modal previous button not found!');
}

const nextBtn = modal?.querySelector('.modal-next');
if (!nextBtn) {
    console.error('Modal next button not found!');
}

let currentPostImages = [];
let currentImageIndex = 0;
let loadedImages = new Set(); // Track which images have been loaded
let currentVideo = null; // Track current video element
let currentPost = null; // Track current post element

function updateModalImage(imageData) {
    if (!imageData || !imageData.src) {
        console.error('Invalid image data:', imageData);
        return;
    }

    if (!modalImage || !modalCaption || !modalComments) {
        console.error('Required modal elements not found!');
        return;
    }

    // Store current dimensions
    const modalBox = modal.querySelector('.modal-box');
    if (modalBox) {
        const style = window.getComputedStyle(modalBox);
        const currentWidth = modalBox.offsetWidth - 
            parseFloat(style.paddingLeft) - 
            parseFloat(style.paddingRight) - 
            parseFloat(style.marginLeft) - 
            parseFloat(style.marginRight);
        const currentHeight = modalBox.offsetHeight - 
            parseFloat(style.paddingTop) - 
            parseFloat(style.paddingBottom) - 
            parseFloat(style.marginTop) - 
            parseFloat(style.marginBottom);
    }
    // Parse comments with better error handling
    let comments = [];
    try {
        const commentsStr = currentPost.getAttribute('data-comments');
        if (commentsStr) {
            // First unescape the HTML entities
            const unescapedComments = commentsStr
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            comments = JSON.parse(unescapedComments);
        }
    } catch (e) {
        console.error('Error parsing comments:', e);
        comments = [];
    }

    // Add loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    modalImage.appendChild(spinner);

    // Create and add the media element
    const isVideo = imageData.type === 'video' || (imageData.src && imageData.src.toLowerCase().endsWith('.mp4'));

    if (isVideo) {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        video.className = 'modal-video';
        
        const source = document.createElement('source');
        source.src = imageData.src;
        source.type = 'video/mp4';
        video.appendChild(source);

        // Show thumbnail while video loads
        if (imageData.thumbnail) {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageData.thumbnail;
            thumbnail.className = 'modal-thumbnail';
            modalImage.appendChild(thumbnail);
        }

        // Handle video loading
        video.addEventListener('loadeddata', () => {
            spinner.remove();
            const thumbnail = modalImage.querySelector('.modal-thumbnail');
            if (thumbnail) thumbnail.remove();
            // Clear previous content and add video
            modalImage.innerHTML = '';
            modalImage.appendChild(video);
            // Reset fixed dimensions
            if (modalBox) {
                modalBox.style.width = '';
                modalBox.style.height = '';
            }
        });

        video.addEventListener('error', (e) => {
            console.error('Error loading video:', e);
            spinner.remove();
            modalImage.innerHTML = '<div class="error-message">Error loading video</div>';
            // Reset fixed dimensions
            if (modalBox) {
                modalBox.style.width = '';
                modalBox.style.height = '';
            }
        });

        modalImage.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.className = 'modal-image-content';
        img.alt = imageData.caption || '';
        img.style.visibility = 'hidden'; // Hide until loaded
        // Set width/height to match modalImage's current content (if any)
        const prevImg = modalImage.querySelector('img.modal-image-content');
        if (prevImg) {
            img.style.width = 0 + 'px';
            img.style.height = 0 + 'px';
        } else {
            img.style.width = '';
            img.style.height = '';
        }

        // Handle image loading
        img.onload = () => {
            // Dramatic shift left (halfway point)
            spinner.remove();
            loadedImages.add(imageData.src);
            // Clear previous content and add image
            modalImage.innerHTML = '';
            // Empty image, thin vertical slice
            img.style.visibility = 'visible';
            img.style.width = '';
            img.style.height = '';
            modalImage.appendChild(img);
            // Reset fixed dimensions
            if (modalBox) {
                modalBox.style.width = '';
                modalBox.style.height = '';
            }

            // Image back to normal

            // If this image has a corresponding video, add play button overlay
            if (imageData.hasVideo) {
                const playButton = document.createElement('div');
                playButton.className = 'play-button';
                playButton.innerHTML = '▶';
                playButton.onclick = (e) => {
                    e.stopPropagation();
                    // Replace image with video
                    const video = document.createElement('video');
                    video.controls = true;
                    video.autoplay = true;
                    video.loop = true;
                    video.className = 'modal-video';

                    const source = document.createElement('source');
                    source.src = imageData.videoSrc;
                    source.type = 'video/mp4';
                    video.appendChild(source);

                    // Handle video loading
                    video.addEventListener('loadeddata', () => {
                        spinner.remove();
                    });

                    video.addEventListener('error', (e) => {
                        console.error('Error loading video:', e);
                        spinner.remove();
                        modalImage.innerHTML = '<div class="error-message">Error loading video</div>';
                    });

                    modalImage.innerHTML = '';
                    modalImage.appendChild(video);
                };
                modalImage.appendChild(playButton);
            }
        };

        img.onerror = (e) => {
            console.error('Error loading image:', e);
            spinner.remove();
            img.src = 'img/placeholder.jpg';
            // Reset fixed dimensions
            if (modalBox) {
                modalBox.style.width = '';
                modalBox.style.height = '';
            }
        };

        // Only load the image if we haven't loaded it before
        if (!loadedImages.has(imageData.src)) {
            img.src = imageData.src;
        } else {
            img.src = imageData.src;
            spinner.remove();
            // Reset fixed dimensions
            if (modalBox) {
                modalBox.style.width = '';
                modalBox.style.height = '';
            }
            img.style.visibility = 'visible';
            img.style.position = '';
            img.style.width = '';
            img.style.height = '';
            img.style.pointerEvents = '';
        }

        modalImage.appendChild(img);
    }

    // Update caption
    if (imageData.caption) {
        modalCaption.textContent = imageData.caption;
    }

    // Update comments
    if (comments.length > 0) {
        // Clear existing comments first
        modalComments.innerHTML = '';
        // Sort comments by created_at timestamp (oldest first)
        const sortedComments = comments.sort((a, b) => a.created_at - b.created_at);
        
        // Flatten comments and their replies into a single array
        const flattenedComments = sortedComments.reduce((acc, comment) => {
            // Add the main comment
            acc.push(comment);
            // Add any replies with indentation
            if (comment.answers && comment.answers.length > 0) {
                // Sort replies by created_at as well
                const sortedReplies = comment.answers.sort((a, b) => a.created_at - b.created_at);
                sortedReplies.forEach(reply => {
                    acc.push({
                        ...reply,
                        username: '&nbsp;&nbsp;&nbsp;&nbsp;' + reply.owner.username,
                        text: reply.text,
                        isReply: true
                    });
                });
            }
            return acc;
        }, []);

        flattenedComments.forEach((comment, index) => {
            const commentDiv = document.createElement('div');
            const nextIsReply = flattenedComments[index + 1]?.isReply;
            const isLastInChain = comment.isReply && !nextIsReply;
            commentDiv.className = 'comment' + 
                (comment.isReply ? ' reply' : '') + 
                (nextIsReply ? ' no-border' : '') +
                (isLastInChain ? ' last-in-chain' : '');
            commentDiv.innerHTML = `
                <span class="username">${comment.username}</span>
                <span class="comment-text">${comment.text}</span>
            `;
            modalComments.appendChild(commentDiv);
        });
    } else {
        modalComments.innerHTML = '<div class="no-comments">No comments</div>';
    }

    // Update navigation buttons
    if (currentPostImages.length > 1) {
        prevBtn.classList.toggle('hidden', currentImageIndex === 0);
        nextBtn.classList.toggle('hidden', currentImageIndex === currentPostImages.length - 1);
    } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    }
}

function updateModalComments(comments) {
    const commentsContainer = document.querySelector('.modal-comments');
    if (!commentsContainer) {
        console.error('Comments container not found');
        return;
    }

    if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = '<div class="no-comments">No comments yet</div>';
        return;
    }

    const commentsHtml = comments.map(comment => {
        // Create the main comment HTML
        let commentHtml = `
            <div class="comment">
                <span class="comment-username">${comment.username}</span>
                <span class="comment-text">${comment.text}</span>
            </div>
        `;

        // Add replies if they exist
        if (comment.answers && comment.answers.length > 0) {
            const repliesHtml = comment.answers.map(reply => `
                <div class="comment-reply">
                    <span class="comment-username">${reply.owner.username}</span>
                    <span class="comment-text">${reply.text}</span>
                </div>
            `).join('');
            commentHtml += repliesHtml;
        }

        return commentHtml;
    }).join('');

    commentsContainer.innerHTML = commentsHtml;
}

// Helper to render comments
function renderComments(comments) {
    if (!comments || comments.length === 0) {
        return '<div class="no-comments"></div>';
    }
    return comments.map(comment => {
        return `<div class="comment"><span class="comment-username">${comment.username}:</span> <span class="comment-text">${comment.text}</span></div>`;
    }).join('');
}

// Add click handlers to all posts
document.querySelectorAll('.post').forEach(post => {
    // Add clone icon if post has multiple images
    const dataImages = post.getAttribute('data-images');
    try {
        const images = JSON.parse(dataImages || '[]');
        if (images.length > 1) {
            const cloneIcon = document.createElement('i');
            cloneIcon.className = 'fa-regular fa-clone clone-icon';
            post.appendChild(cloneIcon);
        }
    } catch (e) {
        console.error('Error parsing data-images:', e);
    }

    post.addEventListener('click', () => {
        currentPost = post; // Store the current post element
        const postId = post.id;
        const baseId = postId.split('_UTC')[0];
        
        // Get all images for this post from data-images attribute
        try {
            currentPostImages = JSON.parse(dataImages || '[]');
        } catch (e) {
            console.error('Error parsing data-images:', e);
            currentPostImages = [];
        }
        
        // If no data-images attribute, use the thumbnail image
        if (currentPostImages.length === 0) {
            const img = post.querySelector('img');
            if (img) {
                currentPostImages = [{
                    src: img.getAttribute('data-src'),
                    caption: post.getAttribute('data-caption')
                }];
            } else {
                console.error('No img element found in post');
                return;
            }
        }

        // Check for videos in the post
        if (!Array.isArray(currentPostImages)) {
            currentPostImages = [];
        }
        const hasVideos = currentPostImages.some(img => img.type === 'video');
        if (hasVideos) {
            // First, identify which images are thumbnails for videos
            const thumbnailImages = new Set();
            currentPostImages.forEach(img => {
                if (img.type === 'video' && img.thumbnail) {
                    thumbnailImages.add(img.thumbnail);
                }
            });

            // For each image, check if it has a corresponding video
            currentPostImages = currentPostImages.map(img => {
                if (img.type === 'video') {
                    return img; // Keep video entries as is for now
                }
                // Check if this image has a corresponding video
                const correspondingVideo = currentPostImages.find(vid => 
                    vid.type === 'video' && vid.thumbnail === img.src
                );
                if (correspondingVideo) {
                    return {
                        ...img,
                        hasVideo: true,
                        videoSrc: correspondingVideo.src
                    };
                }
                return img;
            });

            // Filter out video entries that have thumbnails
            currentPostImages = currentPostImages.filter(img => 
                !(img.type === 'video' && thumbnailImages.has(img.thumbnail))
            );
        }
        
        // Start with the first image
        currentImageIndex = 0;
        updateModalImage(currentPostImages[currentImageIndex]);
        modal.style.display = 'block';
    });
});

// Close modal when clicking the close button
closeBtn.addEventListener('click', () => {
    cleanupCurrentVideo();
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal box
modal.addEventListener('click', (e) => {
    const modalBox = modal.querySelector('.modal-box');
    if (!modalBox.contains(e.target) && e.target !== modalImage && e.target !== currentVideo) {
        cleanupCurrentVideo();
        modal.style.display = 'none';
    }
});

// Helper function to clean up video
function cleanupCurrentVideo() {
    const video = modalImage.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0; // Reset to beginning
        video.removeAttribute('src');
        video.load();
        video.remove(); // Actually remove the video element from the DOM
    }
}

// Navigation handlers
prevBtn.addEventListener('click', () => {
    if (currentImageIndex > 0) {
        cleanupCurrentVideo();
        currentImageIndex--;
        updateModalImage(currentPostImages[currentImageIndex]);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentImageIndex < currentPostImages.length - 1) {
        cleanupCurrentVideo();
        currentImageIndex++;
        updateModalImage(currentPostImages[currentImageIndex]);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') {
            cleanupCurrentVideo();
            modal.style.display = 'none';
        } else if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
            cleanupCurrentVideo();
            currentImageIndex--;
            updateModalImage(currentPostImages[currentImageIndex]);
        } else if (e.key === 'ArrowRight' && currentImageIndex < currentPostImages.length - 1) {
            cleanupCurrentVideo();
            currentImageIndex++;
            updateModalImage(currentPostImages[currentImageIndex]);
        }
    }
});

// Add back-to-top arrow
const backToTop = document.querySelector('.back-to-top');

// Show/hide back-to-top arrow based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});