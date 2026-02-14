// API Configuration
const API_URL = 'https://vm-auto-production.up.railway.app/api';

// Load cars when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCarsForMainPage();
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

// Display cars on main page
function displayCarsOnMainPage(cars) {
    const carsContainer = document.querySelector('.cars-grid');
    
    carsContainer.innerHTML = cars.map(car => `
        <div class="car-card">
            ${car.images && car.images.length > 0 ? `
                <img src="${car.images[0]}" alt="${car.brand} ${car.model}" class="car-image">
            ` : `
                <div class="car-image-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#C94A40" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
            `}
            <div class="car-content">
                <h3 class="car-title">${car.brand} ${car.model}</h3>
                <div class="car-details">
                    <span class="car-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.5-13v5.5l4.5 2.7-.8 1.3L7 10V3h1.5z"/>
                        </svg>
                        ${car.year}
                    </span>
                    ${car.mileage ? `
                        <span class="car-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.5 2.5a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-11z"/>
                            </svg>
                            ${formatNumber(car.mileage)} km
                        </span>
                    ` : ''}
                    ${car.fuel_type ? `
                        <span class="car-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-11z"/>
                            </svg>
                            ${car.fuel_type}
                        </span>
                    ` : ''}
                </div>
                <div class="car-price">${formatPrice(car.price)} PLN</div>
                ${car.autoplac_link ? `
                    <a href="${car.autoplac_link}" target="_blank" rel="noopener noreferrer" class="car-link">
                        Zobacz szczegóły
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                        </svg>
                    </a>
                ` : `
                    <a href="tel:${car.contact_phone || '+48123456789'}" class="car-link">
                        Zadzwoń
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/>
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
