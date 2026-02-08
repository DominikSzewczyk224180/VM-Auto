# VM Auto Backend

Backend API dla systemu zarządzania samochodami VM Auto z integracją Autoplac.pl

## 🚀 Funkcjonalności

- ✅ REST API do zarządzania samochodami
- ✅ Integracja z MongoDB
- ✅ CORS dla GitHub Pages frontend
- 🔄 Automatyczna publikacja na Autoplac.pl (w przygotowaniu)

## 📋 Wymagania

- Python 3.9+
- MongoDB
- Railway account (do deploymentu)

## 🛠️ Instalacja lokalna

1. **Sklonuj repozytorium**
```bash
cd backend
```

2. **Stwórz wirtualne środowisko**
```bash
python -m venv venv
source venv/bin/activate  # Na Windows: venv\Scripts\activate
```

3. **Zainstaluj zależności**
```bash
pip install -r requirements.txt
```

4. **Skonfiguruj zmienne środowiskowe**
```bash
cp .env.example .env
# Edytuj .env i dodaj swoje dane MongoDB
```

5. **Uruchom serwer**
```bash
python app.py
```

Serwer będzie dostępny na `http://localhost:5000`

## 📡 API Endpoints

### Cars

- `GET /api/cars` - Pobierz wszystkie samochody
- `GET /api/cars/<id>` - Pobierz szczegóły samochodu
- `POST /api/cars` - Dodaj nowy samochód
- `PUT /api/cars/<id>` - Aktualizuj samochód
- `DELETE /api/cars/<id>` - Usuń samochód
- `GET /api/cars/search?brand=X&model=Y` - Szukaj samochodów

### Health Check

- `GET /` - Informacje o API
- `GET /api/health` - Status serwera i bazy danych

## 📦 Przykładowe dane samochodu

```json
{
  "brand": "BMW",
  "model": "320d",
  "year": 2020,
  "price": 89000,
  "mileage": 45000,
  "fuel_type": "Diesel",
  "transmission": "Automatyczna",
  "engine_capacity": "2.0",
  "power": "190 KM",
  "body_type": "Sedan",
  "color": "Czarny",
  "vin": "WBA123456789",
  "registration_date": "2020-03-15",
  "description": "Samochód w doskonałym stanie...",
  "features": ["Skórzana tapicerka", "Nawigacja", "Asystent parkowania"],
  "images": ["url1.jpg", "url2.jpg"],
  "contact_phone": "+48 123 456 789",
  "contact_email": "kontakt@vmauto.pl"
}
```

## 🚢 Deploy na Railway

1. Zaloguj się do Railway
2. Stwórz nowy projekt
3. Połącz z GitHubem
4. Dodaj MongoDB z Railway Marketplace
5. Ustaw zmienne środowiskowe
6. Deploy automatycznie

### Zmienne środowiskowe na Railway:
```
MONGODB_URI=<twój_mongodb_uri_z_railway>
DATABASE_NAME=vm_auto_db
SECRET_KEY=<wygeneruj_losowy_string>
DEBUG=False
```

## 🗂️ Struktura projektu

```
backend/
├── app.py                 # Główny plik Flask
├── config.py             # Konfiguracja
├── requirements.txt      # Zależności Python
├── models/
│   └── car.py           # Model samochodu
├── routes/
│   └── cars.py          # Endpointy API
└── services/
    └── autoplac_service.py  # Integracja z Autoplac
```

## 🧪 Testowanie API

Użyj narzędzi jak Postman, Thunder Client lub curl:

```bash
# Pobierz wszystkie samochody
curl http://localhost:5000/api/cars

# Dodaj nowy samochód
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"brand":"BMW","model":"320d","year":2020,"price":89000}'
```

## 📝 TODO

- [ ] Pełna integracja z Autoplac.pl API
- [ ] Upload zdjęć samochodów
- [ ] Panel admina
- [ ] Autoryzacja użytkowników
- [ ] Filtrowanie i sortowanie zaawansowane

## 👤 Autor

Dominik - VM Auto Project

## 📄 Licencja

Projekt prywatny dla VM Auto
