// API Configuration
const API_URL = 'https://vm-auto-production.up.railway.app/api';

// Load cars when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCarsForMainPage();
    loadCarsForCarousel();
});

// Load and display cars on main page
async function loadCarsForMainPage() {
    const carsContainer = document.querySelector('.cars-grid');
    
    if (!carsContainer) {
        return; // Not on cars section
    }
    
    // Show loading
    carsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #6B6B6B;">Ładowanie samochodów...</p>';
    
    try {
        const response = await fetch(`${API_URL}/cars`);
        const result = await response.json();
        
        if (response.ok && result.success && result.cars.length > 0) {
            displayCarsOnMainPage(result.cars);
        } else {
            carsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #6B6B6B;">Brak dostępnych samochodów</p>';
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        carsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #C94A40;">Błąd podczas ładowania samochodów</p>';
    }
}

// Load car images for About carousel
async function loadCarsForCarousel() {
    const carouselTrack = document.getElementById('aboutCarousel');
    
    if (!carouselTrack) {
        return; // Not on about section
    }
    
    try {
        const response = await fetch(`${API_URL}/cars`);
        const result = await response.json();
        
        if (response.ok && result.success && result.cars.length > 0) {
            // Get cars that have images
            const carsWithImages = result.cars.filter(car => car.images && car.images.length > 0);
            
            if (carsWithImages.length > 0) {
                // Replace carousel images with car images
                carouselTrack.innerHTML = carsWithImages.map(car => `
                    <img src="${car.images[0]}" alt="${car.brand} ${car.model}" class="carousel-image">
                `).join('');
                
                // Initialize carousel controls
                initializeCarouselControls();
            }
        }
    } catch (error) {
        console.error('Error loading carousel images:', error);
        // Keep default images on error
    }
}

// Initialize carousel controls
function initializeCarouselControls() {
    const track = document.getElementById('aboutCarousel');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const images = track.querySelectorAll('.carousel-image');
    
    if (!track || images.length === 0) return;
    
    let currentIndex = 0;
    const totalImages = images.length;
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Update carousel position
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }
    
    // Button event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Initial position
    updateCarousel();
}

// Display cars on main page
function displayCarsOnMainPage(cars) {
    const carsContainer = document.querySelector('.cars-grid');
    
    carsContainer.innerHTML = cars.map(car => `
        <div class="car-card">
            ${car.images && car.images.length > 0 ? `
                <img src="${car.images[0]}" alt="${car.brand} ${car.model}" class="car-image">
            ` : `
                <div class="car-image-placeholder" style="background: var(--bg-light); display: flex; align-items: center; justify-content: center; height: 240px; color: var(--text-light);">
                    <span style="font-size: 1.2rem;">Brak zdjęcia</span>
                </div>
            `}
            <div class="car-content">
                <h3 class="car-title">${car.brand} ${car.model}</h3>
                <div class="car-details">
                    <span class="car-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <use href="#icon-calendar"/>
                        </svg>
                        ${car.year}
                    </span>
                    ${car.mileage ? `
                        <span class="car-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <use href="#icon-road"/>
                            </svg>
                            ${formatNumber(car.mileage)} km
                        </span>
                    ` : ''}
                    ${car.fuel_type ? `
                        <span class="car-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <use href="#icon-fuel"/>
                            </svg>
                            ${car.fuel_type}
                        </span>
                    ` : ''}
                </div>
                <div class="car-price">${formatPrice(car.price)} PLN</div>
                ${car.autoplac_link ? `
                    <a href="${car.autoplac_link}" target="_blank" rel="noopener noreferrer" class="car-link">
                        Zobacz szczegóły
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                ` : `
                    <a href="tel:${car.contact_phone || '799999100'}" class="car-link">
                        Zadzwoń
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <use href="#icon-phone"/>
                        </svg>
                    </a>
                `}
            </div>
        </div>
    `).join('');
}

// Format price with thousands separator
function formatPrice(price) {
    return new Intl.NumberFormat('pl-PL').format(price);
}

// Format number with thousands separator
function formatNumber(num) {
    return new Intl.NumberFormat('pl-PL').format(num);
}