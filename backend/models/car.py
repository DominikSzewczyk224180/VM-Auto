from datetime import datetime
from bson import ObjectId

class Car:
    """Car model for MongoDB"""
    
    def __init__(self, data):
        self.brand = data.get('brand', '')
        self.model = data.get('model', '')
        self.year = data.get('year', '')
        self.price = data.get('price', 0)
        self.mileage = data.get('mileage', 0)
        self.fuel_type = data.get('fuel_type', '')
        self.transmission = data.get('transmission', '')
        self.engine_capacity = data.get('engine_capacity', '')
        self.power = data.get('power', '')
        self.body_type = data.get('body_type', '')
        self.color = data.get('color', '')
        self.vin = data.get('vin', '')
        self.registration_date = data.get('registration_date', '')
        self.description = data.get('description', '')
        self.features = data.get('features', [])
        self.images = data.get('images', [])
        self.contact_phone = data.get('contact_phone', '')
        self.contact_email = data.get('contact_email', '')
        self.is_published = data.get('is_published', False)
        self.autoplac_listing_id = data.get('autoplac_listing_id', None)
        self.created_at = data.get('created_at', datetime.utcnow())
        self.updated_at = data.get('updated_at', datetime.utcnow())
    
    def to_dict(self):
        """Convert car object to dictionary"""
        return {
            'brand': self.brand,
            'model': self.model,
            'year': self.year,
            'price': self.price,
            'mileage': self.mileage,
            'fuel_type': self.fuel_type,
            'transmission': self.transmission,
            'engine_capacity': self.engine_capacity,
            'power': self.power,
            'body_type': self.body_type,
            'color': self.color,
            'vin': self.vin,
            'registration_date': self.registration_date,
            'description': self.description,
            'features': self.features,
            'images': self.images,
            'contact_phone': self.contact_phone,
            'contact_email': self.contact_email,
            'is_published': self.is_published,
            'autoplac_listing_id': self.autoplac_listing_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @staticmethod
    def validate(data):
        """Validate car data"""
        required_fields = ['brand', 'model', 'year', 'price']
        errors = []
        
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f"{field} is required")
        
        if data.get('price') and not isinstance(data['price'], (int, float)):
            errors.append("Price must be a number")
        
        if data.get('year'):
            try:
                year = int(data['year'])
                if year < 1900 or year > datetime.now().year + 1:
                    errors.append(f"Year must be between 1900 and {datetime.now().year + 1}")
            except ValueError:
                errors.append("Year must be a valid number")
        
        return errors
