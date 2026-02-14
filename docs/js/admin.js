// API Configuration - ZMIEŃ NA SWÓJ URL Z RAILWAY!
const API_URL = 'https://vm-auto-production.up.railway.app/api';

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dvnq5pxkg';
const CLOUDINARY_UPLOAD_PRESET = 'vm-auto';

// Global variables
let allCars = [];
let uploadedImages = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeForms();
    initializeCloudinaryWidget();
    loadCars();
});

// Initialize Cloudinary Upload Widget
function initializeCloudinaryWidget() {
    const uploadButton = document.getElementById('uploadWidget');
    
    if (!uploadButton) return;
    
    const myWidget = cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 10,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxFileSize: 5000000, // 5MB
        folder: 'vm-auto',
        resourceType: 'image'
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            const imageUrl = result.info.secure_url;
            uploadedImages.push(imageUrl);
            updateImagePreview();
            updateImagesInput();
        }
    });

    uploadButton.addEventListener('click', function() {
        myWidget.open();
    }, false);
}

// Update image preview
function updateImagePreview() {
    const previewContainer = document.getElementById('imagePreview');
    previewContainer.innerHTML = uploadedImages.map((url, index) => `
        <div class="image-preview-item">
            <img src="${url}" alt="Zdjęcie ${index + 1}">
            <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
        </div>
    `).join('');
}

// Remove image from preview
function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
    updateImagesInput();
}

// Update hidden input with image URLs
function updateImagesInput() {
    document.getElementById('images').value = JSON.stringify(uploadedImages);
}

// Tab Navigation
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active class from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Load cars when switching to car list tab
            if (tabName === 'car-list') {
                loadCars();
            }
        });
    });
}

// Form Initialization
function initializeForms() {
    const addCarForm = document.getElementById('addCarForm');
    addCarForm.addEventListener('submit', handleAddCar);

    const editCarForm = document.getElementById('editCarForm');
    editCarForm.addEventListener('submit', handleEditCar);

    // Close modal when clicking X
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeEditModal);

    // Close modal when clicking outside
    const modal = document.getElementById('editModal');
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditModal();
        }
    });
}

// Add Car
async function handleAddCar(e) {
    e.preventDefault();
    
    showLoading();
    
    const formData = new FormData(e.target);
    const carData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: parseInt(formData.get('year')),
        price: parseFloat(formData.get('price')),
        mileage: parseInt(formData.get('mileage')) || 0,
        fuel_type: formData.get('fuel_type'),
        transmission: formData.get('transmission'),
        engine_capacity: formData.get('engine_capacity'),
        power: formData.get('power'),
        body_type: formData.get('body_type'),
        color: formData.get('color'),
        vin: formData.get('vin'),
        description: formData.get('description'),
        features: formData.get('features') ? formData.get('features').split(',').map(f => f.trim()) : [],
        images: uploadedImages, // Add uploaded images
        contact_phone: formData.get('contact_phone'),
        contact_email: formData.get('contact_email')
    };

    try {
        const response = await fetch(`${API_URL}/cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('Samochód został dodany pomyślnie!', 'success');
            e.target.reset();
            uploadedImages = []; // Clear uploaded images
            updateImagePreview();
            loadCars();
            
            // Switch to car list tab
            document.querySelector('[data-tab="car-list"]').click();
        } else {
            showToast('Błąd: ' + (result.error || 'Nie udało się dodać samochodu'), 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Błąd połączenia z serwerem', 'error');
    } finally {
        hideLoading();
    }
}

// Load Cars
async function loadCars() {
    const container = document.getElementById('carsContainer');
    container.innerHTML = '<p class="loading">Ładowanie samochodów...</p>';

    try {
        const response = await fetch(`${API_URL}/cars`);
        const result = await response.json();

        if (response.ok && result.success) {
            allCars = result.cars;
            displayCars(allCars);
        } else {
            container.innerHTML = '<p class="loading">Błąd podczas ładowania samochodów</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p class="loading">Błąd połączenia z serwerem</p>';
    }
}

// Display Cars
function displayCars(cars) {
    const container = document.getElementById('carsContainer');

    if (cars.length === 0) {
        container.innerHTML = `
            <div class="no-cars">
                <h3>Brak samochodów</h3>
                <p>Dodaj pierwszy samochód, aby zobaczyć go na liście</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cars.map(car => `
        <div class="car-card" data-id="${car._id}">
            ${car.images && car.images.length > 0 ? `
                <div class="car-images">
                    <img src="${car.images[0]}" alt="${car.brand} ${car.model}">
                </div>
            ` : `
                <div class="car-images-placeholder">🚗</div>
            `}
            <div class="car-content">
                <div class="car-header">
                    <h3 class="car-title">${car.brand} ${car.model}</h3>
                    <p class="car-year">${car.year}</p>
                </div>
                
                <div class="car-price">${formatPrice(car.price)} PLN</div>
                
                <div class="car-details">
                    ${car.mileage ? `<div class="car-detail"><strong>Przebieg:</strong> ${formatNumber(car.mileage)} km</div>` : ''}
                    ${car.fuel_type ? `<div class="car-detail"><strong>Paliwo:</strong> ${car.fuel_type}</div>` : ''}
                    ${car.transmission ? `<div class="car-detail"><strong>Skrzynia:</strong> ${car.transmission}</div>` : ''}
                    ${car.engine_capacity ? `<div class="car-detail"><strong>Pojemność:</strong> ${car.engine_capacity}L</div>` : ''}
                    ${car.power ? `<div class="car-detail"><strong>Moc:</strong> ${car.power}</div>` : ''}
                    ${car.body_type ? `<div class="car-detail"><strong>Nadwozie:</strong> ${car.body_type}</div>` : ''}
                </div>
                
                ${car.description ? `<p class="car-description">${car.description}</p>` : ''}
                
                ${car.features && car.features.length > 0 ? `
                    <div class="car-features">
                        <strong>Wyposażenie:</strong> ${car.features.slice(0, 3).join(', ')}
                        ${car.features.length > 3 ? '...' : ''}
                    </div>
                ` : ''}
                
                <div class="car-actions">
                    <button class="btn btn-edit" onclick="openEditModal('${car._id}')">Edytuj</button>
                    <button class="btn btn-danger" onclick="deleteCar('${car._id}')">Usuń</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Cars
function filterCars() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allCars.filter(car => 
        car.brand.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        car.year.toString().includes(searchTerm)
    );
    displayCars(filtered);
}

// Open Edit Modal
function openEditModal(carId) {
    const car = allCars.find(c => c._id === carId);
    if (!car) return;

    document.getElementById('edit_car_id').value = car._id;
    document.getElementById('edit_brand').value = car.brand;
    document.getElementById('edit_model').value = car.model;
    document.getElementById('edit_year').value = car.year;
    document.getElementById('edit_price').value = car.price;
    document.getElementById('edit_mileage').value = car.mileage || '';
    document.getElementById('edit_fuel_type').value = car.fuel_type || '';
    document.getElementById('edit_description').value = car.description || '';

    document.getElementById('editModal').classList.add('active');
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Handle Edit Car
async function handleEditCar(e) {
    e.preventDefault();
    
    const carId = document.getElementById('edit_car_id').value;
    const formData = new FormData(e.target);
    
    const updateData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: parseInt(formData.get('year')),
        price: parseFloat(formData.get('price')),
        mileage: parseInt(formData.get('mileage')) || 0,
        fuel_type: formData.get('fuel_type'),
        description: formData.get('description')
    };

    showLoading();

    try {
        const response = await fetch(`${API_URL}/cars/${carId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('Samochód został zaktualizowany!', 'success');
            closeEditModal();
            loadCars();
        } else {
            showToast('Błąd podczas aktualizacji', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Błąd połączenia z serwerem', 'error');
    } finally {
        hideLoading();
    }
}

// Delete Car
async function deleteCar(carId) {
    if (!confirm('Czy na pewno chcesz usunąć ten samochód?')) {
        return;
    }

    showLoading();

    try {
        const response = await fetch(`${API_URL}/cars/${carId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('Samochód został usunięty', 'success');
            loadCars();
        } else {
            showToast('Błąd podczas usuwania', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Błąd połączenia z serwerem', 'error');
    } finally {
        hideLoading();
    }
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('pl-PL').format(price);
}

function formatNumber(num) {
    return new Intl.NumberFormat('pl-PL').format(num);
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
