// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

mobileMenuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-list a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Load cars from JSON
async function loadCars() {
    try {
        const response = await fetch('cars.json');
        const cars = await response.json();
        displayCars(cars);
    } catch (error) {
        console.error('Error loading cars:', error);
        document.getElementById('carsGrid').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>Przepraszamy, nie udało się załadować oferty. Prosimy o kontakt telefoniczny.</p>
            </div>
        `;
    }
}

// Display cars in the grid
function displayCars(cars) {
    const carsGrid = document.getElementById('carsGrid');

    if (cars.length === 0) {
        carsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>Brak dostępnych pojazdów.</p>
            </div>
        `;
        return;
    }

    carsGrid.innerHTML = cars.map(car => `
        <div class="car-card">
            <img src="${car.image}" alt="${car.title}" class="car-image" onerror="this.src='images/placeholder.jpg'">
            <div class="car-content">
                <h3 class="car-title">${car.title}</h3>
                <div class="car-details">
                    <span class="car-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <use href="#icon-calendar"/>
                        </svg>
                        ${car.year}
                    </span>
                    <span class="car-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <use href="#icon-road"/>
                        </svg>
                        ${car.mileage}
                    </span>
                    <span class="car-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <use href="#icon-fuel"/>
                        </svg>
                        ${car.fuel}
                    </span>
                </div>
                <div class="car-price">${car.price}</div>
                <a href="${car.link}" target="_blank" class="car-link">Zobacz szczegóły</a>
            </div>
        </div>
    `).join('');

    // Animate cards
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.features, .cars-section, .about-section, .reviews-section, .contact-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Load cars when page loads
document.addEventListener('DOMContentLoaded', loadCars);

// Add click effect to buttons
document.querySelectorAll('.btn, .filter-btn, .car-link').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn, .filter-btn, .car-link {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Phone number click tracking (optional analytics)
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Phone number clicked:', link.href);
        // Add analytics tracking here if needed
    });
});

// Email link click tracking (optional analytics)
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Email link clicked:', link.href);
        // Add analytics tracking here if needed
    });
});

// Carousel functionality for About section
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('aboutCarousel');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track) return;
    
    const images = track.querySelectorAll('.carousel-image');
    let currentIndex = 0;
    const totalImages = images.length;
    
    // Create dots
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function updateCarousel() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Auto-advance carousel every 5 seconds
    setInterval(nextSlide, 5000);
});
