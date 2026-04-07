// ========================================
// PARTICLE SYSTEM
// ========================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
        });
    }
    
    connectParticles() {
        this.particles.forEach((particleA, indexA) => {
            this.particles.slice(indexA + 1).forEach(particleB => {
                const dx = particleA.x - particleB.x;
                const dy = particleA.y - particleB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particleA.x, particleA.y);
                    this.ctx.lineTo(particleB.x, particleB.y);
                    this.ctx.stroke();
                }
            });
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.x -= Math.cos(angle) * force * 2;
                    particle.y -= Math.sin(angle) * force * 2;
                }
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            // Keep within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParticles();
        this.connectParticles();
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ========================================
// CUSTOM CURSOR GLOW
// ========================================
class CursorGlow {
    constructor() {
        this.cursor = document.querySelector('.cursor-glow');
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });
    }
}

// ========================================
// 3D TILT EFFECT ON CARDS
// ========================================
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.social-card, .stat-item');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
        });
    }
    
    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
    
    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.social-card, .stat-item, .about-text');
        this.init();
    }
    
    init() {
        this.addScrollClass();
        window.addEventListener('scroll', () => this.handleScroll());
        this.handleScroll(); // Initial check
    }
    
    addScrollClass() {
        this.elements.forEach(el => {
            el.classList.add('scroll-animate');
        });
    }
    
    handleScroll() {
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.8) {
                el.classList.add('active');
            }
        });
    }
}

// ========================================
// COUNTER ANIMATION FOR STATS
// ========================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        if (this.hasAnimated) return;
        
        const aboutSection = document.querySelector('.about-section');
        const rect = aboutSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight * 0.8) {
            this.animateCounters();
            this.hasAnimated = true;
        }
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
}

// ========================================
// SMOOTH SCROLL FOR NAVIGATION
// ========================================
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// PARALLAX SCROLL EFFECT
// ========================================
class ParallaxEffect {
    constructor() {
        this.orbs = document.querySelectorAll('.gradient-orb');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.orbs.forEach((orb, index) => {
            const speed = 0.5 + (index * 0.2);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}

// ========================================
// TYPING EFFECT FOR HERO TAGLINE
// ========================================
class TypingEffect {
    constructor() {
        this.elements = document.querySelectorAll('.typing-text');
        this.init();
    }
    
    init() {
        this.elements.forEach((element, index) => {
            const text = element.textContent;
            element.textContent = '';
            element.style.opacity = '1';
            
            setTimeout(() => {
                this.typeText(element, text, 0);
            }, 800 + (index * 200));
        });
    }
    
    typeText(element, text, index) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => {
                this.typeText(element, text, index + 1);
            }, 50);
        }
    }
}

// ========================================
// CARD HOVER SOUND EFFECT (Optional)
// ========================================
class HoverEffects {
    constructor() {
        this.cards = document.querySelectorAll('.social-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addPulseEffect(card);
            });
        });
    }
    
    addPulseEffect(card) {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = '';
        }, 10);
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Reduce animations on low-end devices
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // Lazy load animations
        if ('IntersectionObserver' in window) {
            this.setupLazyAnimations();
        }
    }
    
    setupLazyAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }
}

// ========================================
// STAGGERED ANIMATION FOR SOCIAL CARDS
// ========================================
class StaggeredAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.social-card');
        this.init();
    }
    
    init() {
        this.cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// ========================================
// BACKGROUND GRADIENT ANIMATION
// ========================================
class GradientAnimation {
    constructor() {
        this.background = document.querySelector('.background');
        this.init();
    }
    
    init() {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            // Subtle hue rotation for dynamic feel
        }, 100);
    }
}

// ========================================
// INITIALIZE ALL SYSTEMS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Core systems
    new ParticleSystem();
    new CursorGlow();
    new CardTilt();
    new ScrollAnimations();
    new CounterAnimation();
    new SmoothScroll();
    new ParallaxEffect();
    new TypingEffect();
    new HoverEffects();
    new PerformanceOptimizer();
    new StaggeredAnimations();
    new GradientAnimation();
    
    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Console Easter Egg
    console.log('%c🚀 Welcome to my Social Hub!', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with passion and code ⚡', 'color: #06b6d4; font-size: 14px;');
});

// ========================================
// RESIZE HANDLER WITH DEBOUNCE
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Handle resize optimizations
        console.log('Window resized');
    }, 250);
});

// ========================================
// PREVENT CONTEXT MENU ON PRODUCTION
// ========================================
// Uncomment below to disable right-click (optional)
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// ========================================
// LOADING SCREEN (Optional Enhancement)
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
});
