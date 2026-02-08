# VM Auto - Strona Internetowa Komisu Samochodowego

![VM Auto Logo](logo.png)

Profesjonalna strona internetowa dla komisu samochodowego VM Auto w Radlinie.

## 🚗 O Projekcie

Nowoczesna, responsywna strona internetowa stworzona dla VM Auto - komisu samochodowego specjalizującego się w sprzedaży sprawdzonych samochodów używanych. Strona zawiera:

- Prezentację aktualnej oferty pojazdów
- Informacje o firmie i jej filozofii działania
- Opinie zadowolonych klientów
- Dane kontaktowe i lokalizację
- W pełni responsywny design (desktop, tablet, mobile)

## 📋 Technologie

- **HTML5** - semantyczna struktura strony
- **CSS3** - nowoczesny styling z animacjami
- **JavaScript (Vanilla)** - dynamiczne funkcjonalności
- **JSON** - baza danych ofert samochodowych

## 🎨 Funkcjonalności

### Nawigacja
- Responsywne menu z hamburgerem na urządzeniach mobilnych
- Smooth scroll do sekcji
- Sticky header z efektem cienia przy scrollowaniu

### Oferta Samochodów
- Dynamiczne ładowanie ofert z pliku JSON
- Filtrowanie pojazdów według kategorii (SUV, Sedan, Hybryda, Kampery)
- Karty produktów z najważniejszymi informacjami
- Linki do szczegółowych ofert na zewnętrznym portalu

### Inne Sekcje
- Hero section z call-to-action
- Sekcja funkcji (4 główne cechy firmy)
- O nas z statystykami
- Opinie klientów
- Mapa i dane kontaktowe

### Efekty Wizualne
- Animacje przy przewijaniu (Intersection Observer)
- Hover effects na kartach i przyciskach
- Ripple effect na przyciskach
- Gradient w sekcji hero

## 📁 Struktura Projektu

```
VM-Auto/
├── index.html          # Główny plik HTML
├── styles.css          # Arkusz stylów CSS
├── script.js           # Funkcjonalności JavaScript
├── cars.json           # Baza danych pojazdów
├── logo.png            # Logo VM Auto
├── images/             # Folder ze zdjęciami
│   ├── hyundai-ioniq.png
│   ├── dethleffs-camper.png
│   ├── kia-sportage.png
│   └── jeep-renegade.png
└── README.md           # Ten plik
```

## 🚀 Instalacja i Uruchomienie

### Lokalnie

1. Sklonuj repozytorium:
```bash
git clone https://github.com/TwojeKonto/VM-Auto.git
cd VM-Auto
```

2. Otwórz plik `index.html` w przeglądarce lub użyj lokalnego serwera:
```bash
# Opcja 1: Python
python -m http.server 8000

# Opcja 2: Node.js (npx)
npx serve

# Opcja 3: VS Code Live Server
# Zainstaluj rozszerzenie "Live Server" i kliknij "Go Live"
```

3. Otwórz przeglądarkę i przejdź do:
```
http://localhost:8000
```

### GitHub Pages

1. Stwórz repozytorium na GitHub o nazwie `VM-Auto`

2. Dodaj pliki do repozytorium:
```bash
git init
git add .
git commit -m "Initial commit - VM Auto website"
git branch -M main
git remote add origin https://github.com/TwojeKonto/VM-Auto.git
git push -u origin main
```

3. Włącz GitHub Pages:
   - Przejdź do Settings > Pages
   - W sekcji "Source" wybierz branch `main`
   - Wybierz folder `/ (root)`
   - Kliknij "Save"

4. Strona będzie dostępna pod adresem:
```
https://TwojeKonto.github.io/VM-Auto/
```

⏱️ **Uwaga**: Pierwsza publikacja może potrwać kilka minut.

## 📝 Aktualizacja Oferty

### Dodawanie Nowego Samochodu

Edytuj plik `cars.json` i dodaj nowy obiekt:

```json
{
    "id": 5,
    "title": "Nazwa Modelu Auta",
    "year": "2023",
    "mileage": "50 000 km",
    "fuel": "Benzyna",
    "price": "75 000 zł",
    "category": "sedan",
    "image": "images/nazwa-auta.png",
    "link": "https://link-do-ogloszenia.pl",
    "description": "Krótki opis samochodu"
}
```

### Kategorie
- `all` - wszystkie (domyślna)
- `suv` - SUV-y
- `sedan` - Sedany
- `hybrid` - Hybrydy
- `camper` - Kampery

### Dodawanie Zdjęcia

1. Umieść zdjęcie w folderze `images/`
2. Nazwij je opisowo, np. `toyota-corolla.jpg`
3. Zaktualizuj ścieżkę w `cars.json`

## 🎨 Personalizacja

### Zmiana Kolorów

Edytuj plik `styles.css`, sekcja CSS Variables:

```css
:root {
    --primary-color: #C94A40;      /* Główny kolor (czerwony) */
    --secondary-color: #5A5A5A;    /* Drugorzędny kolor (szary) */
    --text-dark: #2C2C2C;          /* Ciemny tekst */
    --text-light: #6B6B6B;         /* Jasny tekst */
}
```

### Zmiana Danych Kontaktowych

Edytuj sekcję Contact w pliku `index.html`:
- Adres
- Telefon
- Email
- Godziny otwarcia

### Aktualizacja Logo

Zastąp plik `logo.png` swoim logo, zachowując tę samą nazwę.

## 📱 Responsywność

Strona jest w pełni responsywna i działa poprawnie na:
- 📱 Smartfonach (320px+)
- 📱 Tabletach (768px+)
- 💻 Laptopach (1024px+)
- 🖥️ Dużych monitorach (1920px+)

## ⚡ Wydajność

- Zoptymalizowane obrazy
- Minimalna ilość zależności zewnętrznych
- Lazy loading dla obrazów
- CSS animations wykorzystujące GPU
- Semantic HTML dla SEO

## 🔧 Wsparcie Przeglądarek

- ✅ Chrome (najnowsza wersja)
- ✅ Firefox (najnowsza wersja)
- ✅ Safari (najnowsza wersja)
- ✅ Edge (najnowsza wersja)
- ⚠️ IE11 (podstawowa funkcjonalność)

## 📞 Kontakt

**VM Auto**
- 📍 Adres: Głożyńska 261, 44-310 Radlin
- 📞 Telefon: [799 999 100](tel:799999100)
- ✉️ Email: [kreccik@gmail.com](mailto:kreccik@gmail.com)

## 📄 Licencja

Projekt stworzony dla VM Auto. Wszelkie prawa zastrzeżone © 2026 VM Auto.

## 🛠️ Rozwój

### Planowane Funkcjonalności
- [ ] Integracja z systemem zarządzania ofertami
- [ ] Formularz kontaktowy z walidacją
- [ ] Galeria zdjęć dla każdego pojazdu
- [ ] Wyszukiwarka zaawansowana z filtrami
- [ ] Blog z poradami motoryzacyjnymi
- [ ] Integracja z social media

### Zgłaszanie Błędów

Jeśli znajdziesz błąd lub masz sugestię:
1. Otwórz Issue na GitHubie
2. Opisz problem szczegółowo
3. Dołącz screenshoty jeśli to możliwe

---

**Strona stworzona z ❤️ dla VM Auto**

*Kupujesz bez stresu - sprawdzone auto!* 🚗
