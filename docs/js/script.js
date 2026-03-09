// ============================================
// VM AUTO — Main Frontend Script
// ============================================

// --- Mobile Menu ---
const burger = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');
let overlay = null;

function createOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMenu);
}

function openMenu() {
    mainNav.classList.add('active');
    burger.classList.add('active');
    if (!overlay) createOverlay();
    requestAnimationFrame(() => overlay.classList.add('active'));
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    mainNav.classList.remove('active');
    burger.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
    mainNav.classList.contains('active') ? closeMenu() : openMenu();
});

// Close menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerH = document.querySelector('.header').offsetHeight;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// --- Header scroll effect ---
const header = document.getElementById('header');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            header.classList.toggle('scrolled', window.scrollY > 60);
            updateActiveNav();
            ticking = false;
        });
        ticking = true;
    }
});

// --- Active nav link on scroll ---
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// --- Intersection Observer for animations ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
};

const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, delay);
            animateObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    animateObserver.observe(el);
});

// --- Counter Animation ---
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        if (el.dataset.counted) return; // already animated
        el.dataset.counted = '1';
        
        const target = parseInt(el.dataset.count);
        const span = el.querySelector('span');
        const suffixText = span ? span.textContent : '';
        const duration = 2200;
        const startTime = Date.now();
        
        function tick() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            
            // Set text content safely
            el.innerHTML = current + (suffixText ? '<span>' + suffixText + '</span>' : '');
            
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }
        
        // Start from 0
        el.innerHTML = '0' + (suffixText ? '<span>' + suffixText + '</span>' : '');
        requestAnimationFrame(tick);
    });
}

// Fire counters: try observer first, fallback to timeout
const heroCards = document.querySelector('.hero-card-stack');
if (heroCards) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 300);
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.1 });
    counterObserver.observe(heroCards);
    
    // Fallback — if observer doesn't fire within 2s, just animate
    setTimeout(() => {
        if (!document.querySelector('[data-counted]')) {
            animateCounters();
        }
    }, 2000);
}

// --- Parallax on scroll ---
let rafScroll;
window.addEventListener('scroll', () => {
    if (rafScroll) return;
    rafScroll = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        // Parallax hero elements
        const silCenter = document.querySelector('.hero-bg-silhouette-center');
        const silBottom = document.querySelector('.hero-bg-silhouette');
        if (silCenter) silCenter.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.08}px))`;
        if (silBottom) silBottom.style.transform = `translateX(-50%) translateY(${scrollY * 0.05}px)`;
        
        // Parallax hero text
        const heroText = document.querySelector('.hero-text');
        if (heroText && scrollY < window.innerHeight) {
            heroText.style.transform = `translateY(${scrollY * 0.12}px)`;
            heroText.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        }
        
        rafScroll = null;
    });
});

// --- Tilt effect on stat cards ---
document.querySelectorAll('.hero-stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// --- Magnetic hover on buttons ---
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// --- Carousel ---
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('aboutCarousel');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track) return;
    
    const images = track.querySelectorAll('.carousel-image');
    let currentIndex = 0;
    const total = images.length;
    let autoInterval;
    
    // Create dots
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function update() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }
    
    function goTo(i) {
        currentIndex = i;
        update();
        resetAuto();
    }
    
    function next() {
        currentIndex = (currentIndex + 1) % total;
        update();
    }
    
    function prev() {
        currentIndex = (currentIndex - 1 + total) % total;
        update();
    }
    
    function resetAuto() {
        clearInterval(autoInterval);
        autoInterval = setInterval(next, 5000);
    }
    
    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn.addEventListener('click', () => { next(); resetAuto(); });
    
    autoInterval = setInterval(next, 5000);
    
    // Touch support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
            resetAuto();
        }
    }, { passive: true });
});
