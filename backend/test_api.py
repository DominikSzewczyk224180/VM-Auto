"""
VM Auto Backend - API Test Script
==================================
Prosty skrypt do testowania API bez Postmana

Użycie:
1. Uruchom backend: python app.py
2. W nowym terminalu: python test_api.py
"""

import requests
import json

# Konfiguracja
BASE_URL = "http://localhost:5000"
API_URL = f"{BASE_URL}/api"

print("🧪 VM Auto Backend - API Test")
print("=" * 50)

# Test 1: Health Check
print("\n📡 Test 1: Health Check")
try:
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 2: Dodaj testowe auto
print("\n🚗 Test 2: Dodaj nowe auto")
test_car = {
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
    "description": "Samochód w doskonałym stanie, pierwszy właściciel",
    "features": ["Skórzana tapicerka", "Nawigacja", "Asystent parkowania"],
    "contact_phone": "+48 123 456 789",
    "contact_email": "kontakt@vmauto.pl"
}

try:
    response = requests.post(
        f"{API_URL}/cars",
        json=test_car,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    
    # Zapisz car_id do następnych testów
    car_id = result.get('car_id')
    
except Exception as e:
    print(f"❌ Error: {e}")
    car_id = None

# Test 3: Pobierz wszystkie auta
print("\n📋 Test 3: Pobierz wszystkie auta")
try:
    response = requests.get(f"{API_URL}/cars")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Liczba aut: {result.get('count', 0)}")
    print(f"Response: {json.dumps(result, indent=2)}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 4: Pobierz konkretne auto (jeśli mamy car_id)
if car_id:
    print(f"\n🔍 Test 4: Pobierz auto o ID: {car_id}")
    try:
        response = requests.get(f"{API_URL}/cars/{car_id}")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Error: {e}")

# Test 5: Search
print("\n🔎 Test 5: Szukaj BMW")
try:
    response = requests.get(f"{API_URL}/cars/search?brand=BMW")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Znaleziono: {result.get('count', 0)} aut")
    print(f"Response: {json.dumps(result, indent=2)}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 6: Aktualizuj auto (jeśli mamy car_id)
if car_id:
    print(f"\n✏️ Test 6: Aktualizuj auto {car_id}")
    update_data = {
        "price": 85000,
        "mileage": 46000,
        "description": "Cena obniżona! Samochód w doskonałym stanie!"
    }
    try:
        response = requests.put(
            f"{API_URL}/cars/{car_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"❌ Error: {e}")

# Test 7: Usuń auto (opcjonalnie - odkomentuj jeśli chcesz)
# if car_id:
#     print(f"\n🗑️ Test 7: Usuń auto {car_id}")
#     try:
#         response = requests.delete(f"{API_URL}/cars/{car_id}")
#         print(f"Status: {response.status_code}")
#         print(f"Response: {json.dumps(response.json(), indent=2)}")
#     except Exception as e:
#         print(f"❌ Error: {e}")

print("\n" + "=" * 50)
print("✅ Testy zakończone!")
print("\nJeśli wszystkie testy przeszły pomyślnie, backend działa OK!")
