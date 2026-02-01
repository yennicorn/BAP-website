// ====================================
// IMPROVED PSYCHOLOGY PROGRAM WEBSITE
// Interactive JavaScript Components
// ====================================

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Navigation
class Navigation {
    constructor() {
        this.nav = $('#mainNav');
        this.mobileToggle = $('#mobileToggle');
        this.navMenu = $('#navMenu');
        this.navLinks = $$('.nav-link');
        this.init();
    }

    init() {
        // Handle scroll
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile toggle
        this.mobileToggle?.addEventListener('click', () => this.toggleMobile());
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobile();
                }
            });
        });
        
        // Smooth scroll and active state
        this.setupSmoothScroll();
        this.updateActiveLink();
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.nav?.classList.add('scrolled');
        } else {
            this.nav?.classList.remove('scrolled');
        }
        this.updateActiveLink();
    }

    toggleMobile() {
        this.mobileToggle?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
    }

    closeMobile() {
        this.mobileToggle?.classList.remove('active');
        this.navMenu?.classList.remove('active');
    }

    setupSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = $(href);
                
                if (target) {
                    const navHeight = this.nav?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    updateActiveLink() {
        const sections = $$('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Hero Stats Animation
class StatsAnimator {
    constructor() {
        this.stats = $$('.stat-number');
        this.animated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateStats();
                    this.animated = true;
                }
            });
        }, { threshold: 0.5 });

        const heroSection = $('.hero-section');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }

    animateStats() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };

            updateCount();
        });
    }
}

// FAQ Accordion
class FAQAccordion {
    constructor() {
        this.faqItems = $$('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => this.toggle(item));
        });
    }

    toggle(item) {
        const isActive = item.classList.contains('active');
        
        // Close all items
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// Form Handler
class ContactForm {
    constructor() {
        this.form = $('#contactForm');
        this.init();
    }

    init() {
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const inputs = this.form?.querySelectorAll('input, textarea, select');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            field.classList.add('error');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                return false;
            }
        }
        
        field.classList.remove('error');
        return true;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Simulate form submission
        this.showMessage('Thank you for your message! We will get back to you soon.', 'success');
        this.form.reset();
        
        // In production, you would send the data to your server here
        // this.sendFormData(new FormData(this.form));
    }

    showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            animation: fadeIn 0.3s ease;
        `;
        
        // Insert at top of form
        this.form.insertBefore(messageDiv, this.form.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

// Scroll to Top Button
class ScrollToTop {
    constructor() {
        this.button = $('#scrollTopBtn');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.button?.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        if (window.scrollY > 500) {
            this.button?.classList.add('visible');
        } else {
            this.button?.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Intersection Observer for Animations
class ScrollAnimations {
    constructor() {
        this.elements = $$('.feature-card, .timeline-item, .faculty-card, .testimonial-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Image Lazy Loading
class LazyLoader {
    constructor() {
        this.images = $$('img[data-src]');
        this.init();
    }

    init() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        this.images.forEach(img => imageObserver.observe(img));
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log performance metrics
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
            
            // First Contentful Paint
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                console.log(`${entry.name}: ${entry.startTime}ms`);
            });
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new StatsAnimator();
    new FAQAccordion();
    new ContactForm();
    new ScrollToTop();
    new ScrollAnimations();
    new LazyLoader();
    new PerformanceMonitor();
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Console welcome message
    console.log(
        '%c Welcome to ISPSC Tagudin Psychology Program! ',
        'background: #a82032; color: white; font-size: 16px; padding: 10px; font-weight: bold;'
    );
    console.log(
        '%c Developed with excellence for future psychologists ',
        'background: #6b1621; color: white; font-size: 14px; padding: 5px;'
    );
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is now hidden');
    } else {
        console.log('Page is now visible');
    }
});

// Prevent scroll jank
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll-based logic here
            ticking = false;
        });
        ticking = true;
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        StatsAnimator,
        FAQAccordion,
        ContactForm,
        ScrollToTop,
        ScrollAnimations
    };
}