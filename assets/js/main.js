// AURAFX Main JavaScript - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('AURAFX JS Loaded');
    initNavigation();
    initAnimations();
    initForms();
    initScrollEffects();
    initParticles();
    initCurrentYear();
});

// Navigation - Fixed Mobile Menu
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    console.log('Mobile Menu Button:', mobileMenuButton);
    console.log('Mobile Menu:', mobileMenu);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle - FIXED
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu button clicked');
            
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                // Open menu
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('visible');
                mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
                mobileMenuButton.setAttribute('aria-expanded', 'true');
            } else {
                // Close menu
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('visible');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('visible');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('visible') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuButton.contains(e.target)) {
            
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('visible');
            mobileMenu.classList.add('hidden');
            mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    });

    // Set active nav link based on current page
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === 'index.html' && linkHref === 'index.html') ||
            (currentPage.includes(linkHref) && linkHref !== 'index.html')) {
            link.classList.add('text-blue-600', 'font-bold');
        }
    });
}

// Animations
function initAnimations() {
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Handle counter animations
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                
                // Handle stagger animations
                if (entry.target.classList.contains('section-reveal')) {
                    entry.target.classList.add('revealed');
                    
                    // Animate children with stagger
                    const staggerItems = entry.target.querySelectorAll('.stagger-item');
                    staggerItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements
    document.querySelectorAll('.animate-on-scroll, .counter, .section-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Counter Animation
function animateCounter(element) {
    if (element.getAttribute('data-animated') === 'true') return;
    
    const target = parseInt(element.getAttribute('data-target') || element.textContent.replace(/[^0-9]/g, ''), 10);
    const duration = 2000;
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
            element.setAttribute('data-animated', 'true');
        }
    }
    
    updateCounter();
}

// Forms
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission for demo
            
            if (validateForm(this)) {
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                this.reset();
            }
        });
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[name="email"]').value;
            if (isValidEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Add focus effects to form inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

function showError(input, message) {
    clearError(input);
    input.classList.add('error', 'border-red-500');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-600 text-sm mt-1';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function clearError(input) {
    input.classList.remove('error', 'border-red-500');
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll Effects
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 opacity-0 invisible z-50 back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.remove('opacity-0', 'invisible');
            backToTop.classList.add('opacity-100', 'visible');
        } else {
            backToTop.classList.remove('opacity-100', 'visible');
            backToTop.classList.add('opacity-0', 'invisible');
        }
    });
}

// Particles Animation
function initParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 60 + 10;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
    }
}

// Set current year in footer
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Portfolio filtering
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-600', 'text-white'));
            filterButtons.forEach(btn => btn.classList.add('bg-gray-200', 'text-gray-700'));
            
            // Add active class to clicked button
            this.classList.add('active', 'bg-blue-600', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Utility function for notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <span class="mr-3">${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}</span>
                <span>${message}</span>
            </div>
            <button class="ml-4 text-lg" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize portfolio filter if on portfolio page
if (document.querySelector('.portfolio-filter')) {
    initPortfolioFilter();
}

// Make functions globally available
window.showNotification = showNotification;
window.validateForm = validateForm;


// Client Logos Marquee Functionality
function initClientLogosMarquee() {
    const marqueeTrack1 = document.getElementById('marqueeTrack1');
    const marqueeTrack2 = document.getElementById('marqueeTrack2');
    
    if (!marqueeTrack1 || !marqueeTrack2) return;
    
    // Client data with logo names and images
    const clients = [
        { id: 1, name: "Tech Solutions Inc.", logo: "1.jpg" },
        { id: 2, name: "Creative Minds Agency", logo: "2.png" },
        { id: 3, name: "Global Enterprises", logo: "3.jpg" },
        { id: 4, name: "Innovate Digital", logo: "4.jpg" },
        { id: 5, name: "Prime Solutions", logo: "5.jpg" },
        { id: 6, name: "Visionary Brands", logo: "6.jpg" },
        { id: 7, name: "Elite Services", logo: "7.jpg" },
        { id: 8, name: "Future Tech", logo: "8.png" }
        // { id: 8, name: "Future Tech", logo: "9.pdf" }
    ];
    
    // Function to create logo item
    function createLogoItem(client) {
        const div = document.createElement('div');
        div.className = 'client-logo-item';
        div.setAttribute('data-client', client.name);
        
        const img = document.createElement('img');
        img.className = 'client-logo-img';
        img.src = `assets/img/logos/${client.logo}`;
        img.alt = `${client.name} Logo`;
        img.loading = 'lazy';
        
        // Add error handling
        img.onerror = function() {
            console.warn(`Failed to load logo: ${client.logo}`);
            // Fallback placeholder
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><rect width="100" height="50" fill="%23f1f5f9" rx="8"/><text x="50" y="30" font-family="Arial" font-size="12" text-anchor="middle" fill="%234a5568">' + client.name.substring(0, 10) + '</text></svg>';
        };
        
        div.appendChild(img);
        return div;
    }
    
    // Function to duplicate logos for seamless marquee
    function duplicateLogosForMarquee(track, items) {
        // Clear existing content
        track.innerHTML = '';
        
        // Add logos 3 times for seamless loop
        for (let i = 0; i < 3; i++) {
            items.forEach(client => {
                track.appendChild(createLogoItem(client));
            });
        }
    }
    
    // Initialize both marquee tracks
    duplicateLogosForMarquee(marqueeTrack1, clients);
    duplicateLogosForMarquee(marqueeTrack2, clients);
    
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        marqueeTrack1.classList.add('no-animation');
        marqueeTrack2.classList.add('no-animation');
    }
    
    // Add click event to logos for interaction
    document.querySelectorAll('.client-logo-item').forEach(item => {
        item.addEventListener('click', function() {
            const clientName = this.getAttribute('data-client');
            showNotification(`Viewing ${clientName} project details`, 'info');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
    
    // Pause animation on hover for better UX
    marqueeTrack1.addEventListener('mouseenter', () => {
        if (!marqueeTrack1.classList.contains('no-animation')) {
            marqueeTrack1.style.animationPlayState = 'paused';
        }
    });
    
    marqueeTrack1.addEventListener('mouseleave', () => {
        if (!marqueeTrack1.classList.contains('no-animation')) {
            marqueeTrack1.style.animationPlayState = 'running';
        }
    });
    
    marqueeTrack2.addEventListener('mouseenter', () => {
        if (!marqueeTrack2.classList.contains('no-animation')) {
            marqueeTrack2.style.animationPlayState = 'paused';
        }
    });
    
    marqueeTrack2.addEventListener('mouseleave', () => {
        if (!marqueeTrack2.classList.contains('no-animation')) {
            marqueeTrack2.style.animationPlayState = 'running';
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reinitialize on resize for better responsiveness
            duplicateLogosForMarquee(marqueeTrack1, clients);
            duplicateLogosForMarquee(marqueeTrack2, clients);
        }, 250);
    });
}

// Initialize the marquee when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add this to your existing init functions
    initClientLogosMarquee();
});


// Testimonials Carousel Functionality
function initTestimonialsCarousel() {
    const carouselTrack = document.getElementById('testimonialCarousel');
    const carouselDots = document.getElementById('carouselDots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!carouselTrack || window.innerWidth > 768) return;
    
    // Testimonials data
    const testimonials = [
        {
            name: "Maaz Vohra",
            role: "Business Owner",
            initial: "M",
            text: "Working with AURAFX was a game-changer for our business. Their web development team delivered a stunning website that perfectly represents our brand. The attention to detail and professionalism were outstanding.",
            rating: 5
        },
        {
            name: "Dr. Dhanwantari Jha",
            role: "Healthcare Professional",
            initial: "D",
            text: "As a healthcare professional, I needed a website that builds trust with patients. AURAFX created a beautiful, professional medical website that has significantly increased our online appointments. Highly recommended!",
            rating: 5
        },
        {
            name: "Tosif Halani",
            role: "Entrepreneur",
            initial: "T",
            text: "The mobile app developed by AURAFX has revolutionized our customer engagement. Their team understood our vision perfectly and delivered a smooth, user-friendly application that our customers love using.",
            rating: 5
        },
        {
            name: "Dr. Rohit Nimavat",
            role: "Medical Practitioner",
            initial: "R",
            text: "Excellent service! Our clinic's digital presence has improved dramatically. The SEO work done by AURAFX has brought us more patients than ever before. They truly understand the medical field's unique requirements.",
            rating: 5
        },
        {
            name: "Bhavya Auto",
            role: "Automobile Business",
            initial: "B",
            text: "As an automobile business, we needed a robust website to showcase our inventory. AURAFX delivered beyond expectations with features that make car browsing easy for customers. Sales have increased by 40%!",
            rating: 5
        },
        {
            name: "FTV Café & Restro",
            role: "Restaurant & Café",
            initial: "F",
            text: "Our restaurant's online ordering system created by AURAFX has been a tremendous success. The user-friendly interface and smooth functionality have made it easy for customers to order online. Highly recommended for any food business!",
            rating: 5
        }
    ];
    
    let currentSlide = 0;
    
    // Create slides
    function createSlides() {
        carouselTrack.innerHTML = '';
        carouselDots.innerHTML = '';
        
        testimonials.forEach((testimonial, index) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        <div class="testimonial-quote">"</div>
                        <p class="testimonial-text">${testimonial.text}</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-avatar">${testimonial.initial}</div>
                        <div class="author-info">
                            <h4 class="author-name">${testimonial.name}</h4>
                            <p class="author-company">${testimonial.role}</p>
                            <div class="author-rating">
                                ${'<span class="rating-star">★</span>'.repeat(testimonial.rating)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            carouselTrack.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.addEventListener('click', () => goToSlide(index));
            carouselDots.appendChild(dot);
        });
        
        updateCarousel();
    }
    
    // Update carousel position
    function updateCarousel() {
        const slideWidth = carouselTrack.children[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Update active dot
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateCarousel();
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        updateCarousel();
    }
    
    // Initialize
    createSlides();
    
    // Add event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto slide every 5 seconds
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto slide on hover
    carouselTrack.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    carouselTrack.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// Initialize testimonials when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsCarousel();
    
    // Add hover effect to testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});