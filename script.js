// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollAnimation();
    
    // Page-specific initializations
    if (document.querySelector('.testimonials-slider')) {
        initializeTestimonialSlider();
    }
    
    if (document.querySelector('.gallery-grid')) {
        initializeGallery();
    }
    
    if (document.querySelector('.rating-select')) {
        initializeRatingSystem();
    }
});

// Mobile Navigation Toggle
function initializeNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            navOverlay.classList.toggle('active');
            body.classList.toggle('nav-open');
        });
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            nav.classList.remove('active');
            this.classList.remove('active');
            body.classList.remove('nav-open');
        });
    }
    
    // Handle scroll for header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Set active nav link based on current page
    setActiveNavLink();
}

// Theme Toggle (Light/Dark)
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'dark-theme';
    
    // Set initial theme
    body.classList.add(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
}

// Testimonial Slider
function initializeTestimonialSlider() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    
    // Update active testimonial
    function updateActiveTestimonial(index) {
        testimonialItems.forEach(item => item.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialItems[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    // Attach event listeners to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateActiveTestimonial(index);
        });
    });
    
    // Auto rotate testimonials
    setInterval(function() {
        currentIndex = (currentIndex + 1) % testimonialItems.length;
        updateActiveTestimonial(currentIndex);
    }, 5000);
}

// Gallery Filter and Modal
function initializeGallery() {
    // Gallery filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category').includes(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Gallery modal
    const galleryModal = document.querySelector('.gallery-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalImage = document.querySelector('.modal-image .image-placeholder');
    const modalTitle = document.querySelector('.modal-caption h3');
    const modalDesc = document.querySelector('.modal-caption p');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    let currentItemIndex = 0;
    
    // Open modal when gallery item is clicked
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const image = this.querySelector('.gallery-image .image-placeholder').cloneNode(true);
            const title = this.querySelector('.gallery-caption h4').textContent;
            const desc = this.querySelector('.gallery-caption p').textContent;
            
            modalImage.innerHTML = '';
            modalImage.appendChild(image);
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            
            galleryModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            currentItemIndex = index;
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            galleryModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    
    // Next and previous buttons
    if (modalPrev) {
        modalPrev.addEventListener('click', function() {
            navigateGallery(-1);
        });
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', function() {
            navigateGallery(1);
        });
    }
    
    // Navigate through gallery items
    function navigateGallery(direction) {
        currentItemIndex = (currentItemIndex + direction + galleryItems.length) % galleryItems.length;
        
        // Skip hidden items
        while (galleryItems[currentItemIndex].style.display === 'none') {
            currentItemIndex = (currentItemIndex + direction + galleryItems.length) % galleryItems.length;
        }
        
        const image = galleryItems[currentItemIndex].querySelector('.gallery-image .image-placeholder').cloneNode(true);
        const title = galleryItems[currentItemIndex].querySelector('.gallery-caption h4').textContent;
        const desc = galleryItems[currentItemIndex].querySelector('.gallery-caption p').textContent;
        
        modalImage.innerHTML = '';
        modalImage.appendChild(image);
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
    }
}

// Rating System for Reviews
function initializeRatingSystem() {
    const stars = document.querySelectorAll('.rating-select i');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            // Reset all stars
            stars.forEach(s => s.className = 'far fa-star');
            
            // Fill stars up to selected rating
            for (let i = 0; i < rating; i++) {
                stars[i].className = 'fas fa-star active';
            }
        });
    });
}

// Scroll Animation
function initializeScrollAnimation() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about-preview') || document.querySelector('#about');
            if (aboutSection) {
                window.scrollTo({
                    top: aboutSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                
                window.scrollTo({
                    top: document.querySelector(targetId).offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileToggle = document.querySelector('.mobile-toggle');
                const nav = document.querySelector('nav');
                const navOverlay = document.querySelector('.nav-overlay');
                
                if (mobileToggle && mobileToggle.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    nav.classList.remove('active');
                    navOverlay.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            }
        });
    });
}

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' || currentPage === '/' && link.getAttribute('href') === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Premium Scroll Indicator
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        // Get the about section for more precise scrolling
        const aboutSection = document.querySelector('#about');
        
        if (aboutSection) {
            // Adjust offset based on screen size
            let headerOffset = window.innerWidth > 768 ? 70 : 60;
            const scrollTarget = aboutSection.offsetTop - headerOffset;
            
            window.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        } else {
            // Fallback to approximate height if section not found
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    });
}

// Testimonials Slider
const testimonialItems = document.querySelectorAll('.testimonial-item');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let testimonialInterval;

if (testimonialItems.length > 0) {
    // Initialize testimonial slider
    startTestimonialSlider();

    // Click on dots to navigate
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showTestimonial(index);
        });
    });

    // Pause slider on hover
    const testimonialSlider = document.querySelector('.testimonials-slider');
    testimonialSlider.addEventListener('mouseenter', function() {
        clearInterval(testimonialInterval);
    });

    testimonialSlider.addEventListener('mouseleave', function() {
        startTestimonialSlider();
    });
}

function startTestimonialSlider() {
    testimonialInterval = setInterval(function() {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

function showTestimonial(index) {
    testimonialItems.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonialItems[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentTestimonial = index;
}

// Enhanced Menu Interaction
const menuCategories = document.querySelectorAll('.menu-category');

menuCategories.forEach(category => {
    category.addEventListener('mouseenter', function() {
        this.classList.add('active');
    });
    
    category.addEventListener('mouseleave', function() {
        this.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
const smoothScrollLinks = document.querySelectorAll('nav a, .scroll-indicator, .menu-cta a, .footer-column a[href^="#"]');
smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Only prevent default for links pointing to sections
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Adjust offset based on screen size
                let headerOffset = window.innerWidth > 768 ? 70 : 60;
                const offsetTop = targetSection.offsetTop - headerOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Reveal animations on scroll with enhanced effects
const revealElements = document.querySelectorAll('.container, .decorative-divider');

const revealOnScroll = function() {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        // Adjust visible threshold based on screen size
        const elementVisible = window.innerHeight > 768 ? 150 : 100;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

// Add active class to containers
revealElements.forEach(element => {
    element.classList.add('reveal');
});

// Call the function on load and scroll
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Newsletter Form Interaction
const subscribeForm = document.querySelector('.subscribe-form');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
            emailInput.classList.add('error');
            return;
        }
        
        // Success animation
        emailInput.classList.remove('error');
        emailInput.value = '';
        emailInput.placeholder = 'Thank you for subscribing!';
        emailInput.disabled = true;
        
        // Reset after delay
        setTimeout(() => {
            emailInput.disabled = false;
            emailInput.placeholder = 'Your email';
        }, 3000);
    });
}

// Add hover effect to menu items
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.classList.add('active');
    });
    
    item.addEventListener('mouseleave', function() {
        this.classList.remove('active');
    });
});

// Form validation
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Simple validation
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Please enter a message');
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        if (isValid) {
            // In a real application, you would submit the form data here
            showSuccessMessage(contactForm);
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorElement);
    }
    
    input.classList.add('error');
}

function removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        formGroup.removeChild(errorElement);
    }
    
    input.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Your message has been sent successfully!';
    
    form.innerHTML = '';
    form.appendChild(successMessage);
}

// Add touch swipe for gallery and testimonials
let touchStartX = 0;
let touchEndX = 0;

// Touch swipe for testimonials
if (testimonialItems.length > 0) {
    const testimonialSlider = document.querySelector('.testimonials-slider');
    
    testimonialSlider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    testimonialSlider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left, show next
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        }
        
        if (touchEndX > touchStartX + 50) {
            // Swipe right, show previous
            currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        }
    }
}

// Touch swipe for gallery modal
if (galleryModal) {
    galleryModal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    galleryModal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleModalSwipe();
    }, false);
    
    function handleModalSwipe() {
        if (!galleryModal.classList.contains('open')) return;
        
        if (touchEndX < touchStartX - 50 && nextBtn) {
            // Swipe left, show next
            nextBtn.click();
        }
        
        if (touchEndX > touchStartX + 50 && prevBtn) {
            // Swipe right, show previous
            prevBtn.click();
        }
    }
}

// Premium button hover effects
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.classList.add('btn-hover');
    });
    
    button.addEventListener('mouseleave', function() {
        this.classList.remove('btn-hover');
    });
});

// Add parallax effect to hero section with enhanced depth
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero');
    const scrollY = window.scrollY;
    
    if (heroSection) {
        // Enhanced parallax with depth effect
        // Only apply parallax on devices that can handle it (disable on low-power devices)
        if (window.matchMedia('(min-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            heroSection.style.backgroundPositionY = scrollY * 0.5 + 'px';
            
            // Fade out content slightly on scroll
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrollY < window.innerHeight) {
                const opacity = 1 - (scrollY / (window.innerHeight * 0.5)) * 0.5;
                heroContent.style.opacity = Math.max(opacity, 0.5);
                heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
            }
        }
    }
    
    // Decorative dividers parallax - only apply on non-mobile
    if (window.matchMedia('(min-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const dividers = document.querySelectorAll('.decorative-divider');
        dividers.forEach(divider => {
            const dividerTop = divider.getBoundingClientRect().top + scrollY;
            const distanceFromTop = scrollY - dividerTop;
            
            if (Math.abs(distanceFromTop) < window.innerHeight) {
                const dividerIcon = divider.querySelector('.divider-icon');
                if (dividerIcon) {
                    dividerIcon.style.transform = `rotate(${distanceFromTop * 0.02}deg)`;
                }
            }
        });
    }
}); 