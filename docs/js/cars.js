// ============================================
// VM AUTO — Cars Loading Script
// ============================================

// API Configuration
const API_URL = 'https://vm-auto-production.up.railway.app/api';

// Load cars when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCarsForMainPage();
    loadCarsForCarousel();
    buildMarquee();
});

// Load and display cars on main page
async function loadCarsForMainPage() {
    const carsContainer = document.querySelector('.cars-grid');
    if (!carsContainer) return;
    
    carsContainer.innerHTML = '<p style="text-align:center; padding:60px 20px; color:var(--text-secondary); grid-column:1/-1; font-size:1rem;">Ładowanie samochodów...</p>';
    
    try {
        // Try API first
        const response = await fetch(`${API_URL}/cars`);
        const result = await response.json();
        
        if (response.ok && result.success && result.cars.length > 0) {
            displayCarsFromAPI(result.cars, carsContainer);
            return;
        }
    } catch (error) {
        console.log('API unavailable, falling back to JSON:', error.message);
    }
    
    // Fallback to local JSON
    try {
        const response = await fetch('cars.json');
        const cars = await response.json();
        displayCarsFromJSON(cars, carsContainer);
    } catch (error) {
        console.error('Error loading cars:', error);
        carsContainer.innerHTML = '<p style="text-align:center; padding:60px 20px; color:var(--text-secondary); grid-column:1/-1;">Przepraszamy, nie udało się załadować oferty. Prosimy o kontakt telefoniczny.</p>';
    }
}

// Display cars from API
function displayCarsFromAPI(cars, container) {
    container.innerHTML = cars.map((car, ci) => `
        <div class="car-card" data-animate="fade-up">
            ${car.images && car.images.length > 0 ? `
                <div class="car-image-wrap" id="carGal${ci}">
                    ${car.images.map((img, ii) => `
                        <img src="${img}" alt="${car.brand} ${car.model}" class="car-image ${ii === 0 ? 'active' : ''}" data-idx="${ii}" loading="lazy">
                    `).join('')}
                    ${car.images.length > 1 ? `
                        <button class="car-gal-btn car-gal-prev" onclick="galNav(${ci},-1)" aria-label="Poprzednie">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button class="car-gal-btn car-gal-next" onclick="galNav(${ci},1)" aria-label="Następne">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                        <div class="car-gal-dots">
                            ${car.images.map((_, ii) => `<span class="car-gal-dot ${ii === 0 ? 'active' : ''}" data-idx="${ii}"></span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            ` : `
                <div class="car-image-placeholder">Brak zdjęcia</div>
            `}
            <div class="car-content">
                <h3 class="car-title">${car.brand} ${car.model}</h3>
                <div class="car-details">
                    <span class="car-detail">
                        <svg width="15" height="15" viewBox="0 0 24 24"><use href="#icon-calendar"/></svg>
                        ${car.year}
                    </span>
                    ${car.mileage ? `
                        <span class="car-detail">
                            <svg width="15" height="15" viewBox="0 0 24 24"><use href="#icon-road"/></svg>
                            ${formatNumber(car.mileage)} km
                        </span>
                    ` : ''}
                    ${car.fuel_type ? `
                        <span class="car-detail">
                            <svg width="15" height="15" viewBox="0 0 24 24"><use href="#icon-fuel"/></svg>
                            ${car.fuel_type}
                        </span>
                    ` : ''}
                </div>
                <div class="car-price">${formatPrice(car.price)} PLN</div>
                ${car.autoplac_link ? `
                    <a href="${car.autoplac_link}" target="_blank" rel="noopener noreferrer" class="car-link">
                        Zobacz ogłoszenie
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                ` : `
                    <a href="tel:${car.contact_phone || '+48799939100'}" class="car-link">
                        Zadzwoń
                        <svg width="16" height="16" viewBox="0 0 24 24"><use href="#icon-phone"/></svg>
                    </a>
                `}
            </div>
        </div>
    `).join('');
    
    observeNewCards(container);
}

// Gallery navigation
function galNav(cardIdx, dir) {
    const wrap = document.getElementById('carGal' + cardIdx);
    if (!wrap) return;
    const imgs = wrap.querySelectorAll('.car-image');
    const dots = wrap.querySelectorAll('.car-gal-dot');
    let current = [...imgs].findIndex(i => i.classList.contains('active'));
    imgs[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (current + dir + imgs.length) % imgs.length;
    imgs[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
}

// Display cars from local JSON
function displayCarsFromJSON(cars, container) {
    if (cars.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:60px 20px; color:var(--text-secondary); grid-column:1/-1;">Brak dostępnych pojazdów.</p>';
        return;
    }
    
    container.innerHTML = cars.map(car => `
        <div class="car-card" data-animate="fade-up">
            <div class="car-image-wrap">
                <img src="${car.image}" alt="${car.title}" class="car-image" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'car-image-placeholder\\'>Brak zdjęcia</div>'">
            </div>
            <div class="car-content">
                <h3 class="car-title">${car.title}</h3>
                <div class="car-details">
                    <span class="car-detail">
                        <svg width="15" height="15" viewBox="0 0 24 24"><use href="#icon-calendar"/></svg>
                        ${car.year}
                    </span>
                    <span class="car-detail">
                        <svg width="15" height="15" viewBox="0 0 24 24"><use href="#icon-road"/></svg>
                        ${car.mileage}
                    </span>
                    <span class="car-detail">
                        <svg width="15" height="15" viewBox="0 0 24 24"><use href="#icon-fuel"/></svg>
                        ${car.fuel}
                    </span>
                </div>
                <div class="car-price">${car.price}</div>
                <a href="${car.link}" target="_blank" rel="noopener noreferrer" class="car-link">
                    Zobacz ogłoszenie
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            </div>
        </div>
    `).join('');
    
    observeNewCards(container);
}

// Observe dynamically added cards
function observeNewCards(container) {
    const cards = container.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('animated'), i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => observer.observe(card));
}

// Load car images for About carousel
async function loadCarsForCarousel() {
    const carouselTrack = document.getElementById('aboutCarousel');
    if (!carouselTrack) return;
    
    try {
        const response = await fetch(`${API_URL}/cars`);
        const result = await response.json();
        
        if (response.ok && result.success && result.cars.length > 0) {
            const carsWithImages = result.cars.filter(car => car.images && car.images.length > 0);
            
            if (carsWithImages.length > 0) {
                carouselTrack.innerHTML = carsWithImages.map(car => `
                    <img src="${car.images[0]}" alt="${car.brand} ${car.model}" class="carousel-image" loading="lazy">
                `).join('');
                
                // Re-init carousel dots
                reinitCarouselDots();
            }
        }
    } catch (error) {
        console.log('Carousel: using default images');
    }
}

function reinitCarouselDots() {
    const track = document.getElementById('aboutCarousel');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track || !dotsContainer) return;
    
    const images = track.querySelectorAll('.carousel-image');
    dotsContainer.innerHTML = '';
    
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
    });
}

// Utilities
function formatPrice(price) {
    return new Intl.NumberFormat('pl-PL').format(price);
}

function formatNumber(num) {
    return new Intl.NumberFormat('pl-PL').format(num);
}

// Build vertical car scroll in hero
async function buildMarquee() {
    const container = document.getElementById('heroCarScroll');
    if (!container) return;
    
    let cars = [];
    
    // Try API first
    try {
        const resp = await fetch(`${API_URL}/cars`);
        const result = await resp.json();
        if (resp.ok && result.success && result.cars.length > 0) {
            cars = result.cars.map(c => ({
                title: c.brand + ' ' + c.model,
                price: formatPrice(c.price) + ' PLN',
                image: (c.images && c.images.length > 0) ? c.images[0] : null,
                link: c.autoplac_link || '#cars'
            }));
        }
    } catch(e) {}
    
    // Fallback to JSON
    if (cars.length === 0) {
        try {
            const resp = await fetch('cars.json');
            const data = await resp.json();
            cars = data.map(c => ({
                title: c.title,
                price: c.price,
                image: c.image,
                link: c.link || '#cars'
            }));
        } catch(e) {}
    }
    
    if (cars.length === 0) {
        container.closest('.hero-right').style.display = 'none';
        return;
    }
    
    // Duplicate enough for seamless vertical loop
    const items = [...cars, ...cars, ...cars, ...cars, ...cars];
    
    container.innerHTML = items.map(car => `
        <a href="${car.link}" target="_blank" rel="noopener" class="scroll-car-card">
            ${car.image ? `<img src="${car.image}" alt="${car.title}" loading="lazy">` : ''}
            <div class="scroll-car-info">
                <div class="scroll-car-title">${car.title}</div>
                <div class="scroll-car-price">${car.price}</div>
            </div>
        </a>
    `).join('');
}
