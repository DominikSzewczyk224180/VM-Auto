from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from datetime import datetime
from models.car import Car

cars_bp = Blueprint('cars', __name__)

def get_db():
    """Get database from current app"""
    return current_app.db

@cars_bp.route('/cars', methods=['GET'])
def get_all_cars():
    """Get all cars from database"""
    try:
        db = get_db()
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cars_collection = db['cars']
        cars = list(cars_collection.find())
        
        # Convert ObjectId to string for JSON serialization
        for car in cars:
            car['_id'] = str(car['_id'])
            # Convert datetime to ISO format
            if 'created_at' in car:
                car['created_at'] = car['created_at'].isoformat()
            if 'updated_at' in car:
                car['updated_at'] = car['updated_at'].isoformat()
        
        return jsonify({
            "success": True,
            "count": len(cars),
            "cars": cars
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cars_bp.route('/cars/<car_id>', methods=['GET'])
def get_car(car_id):
    """Get a single car by ID"""
    try:
        db = get_db()
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cars_collection = db['cars']
        car = cars_collection.find_one({"_id": ObjectId(car_id)})
        
        if not car:
            return jsonify({"error": "Car not found"}), 404
        
        # Convert ObjectId to string
        car['_id'] = str(car['_id'])
        if 'created_at' in car:
            car['created_at'] = car['created_at'].isoformat()
        if 'updated_at' in car:
            car['updated_at'] = car['updated_at'].isoformat()
        
        return jsonify({
            "success": True,
            "car": car
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cars_bp.route('/cars', methods=['POST'])
def add_car():
    """Add a new car to database"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate car data
        errors = Car.validate(data)
        if errors:
            return jsonify({"error": "Validation failed", "details": errors}), 400
        
        # Create car object
        car = Car(data)
        car_dict = car.to_dict()
        
        # Insert into database
        db = get_db()
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cars_collection = db['cars']
        result = cars_collection.insert_one(car_dict)
        
        return jsonify({
            "success": True,
            "message": "Car added successfully",
            "car_id": str(result.inserted_id)
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cars_bp.route('/cars/<car_id>', methods=['PUT'])
def update_car(car_id):
    """Update an existing car"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Update timestamp
        data['updated_at'] = datetime.utcnow()
        
        db = get_db()
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cars_collection = db['cars']
        result = cars_collection.update_one(
            {"_id": ObjectId(car_id)},
            {"$set": data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Car not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Car updated successfully"
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cars_bp.route('/cars/<car_id>', methods=['DELETE'])
def delete_car(car_id):
    """Delete a car from database"""
    try:
        db = get_db()
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cars_collection = db['cars']
        result = cars_collection.delete_one({"_id": ObjectId(car_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Car not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Car deleted successfully"
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cars_bp.route('/cars/search', methods=['GET'])
def search_cars():
    """Search cars by brand, model, or other criteria"""
    try:
        # Get query parameters
        brand = request.args.get('brand', '')
        model = request.args.get('model', '')
        min_price = request.args.get('min_price', type=int)
        max_price = request.args.get('max_price', type=int)
        year = request.args.get('year', type=int)
        
        # Build search query
        query = {}
        if brand:
            query['brand'] = {'$regex': brand, '$options': 'i'}
        if model:
            query['model'] = {'$regex': model, '$options': 'i'}
        if min_price or max_price:
            query['price'] = {}
            if min_price:
                query['price']['$gte'] = min_price
            if max_price:
                query['price']['$lte'] = max_price
        if year:
            query['year'] = year
        
        db = get_db()
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cars_collection = db['cars']
        cars = list(cars_collection.find(query))
        
        # Convert ObjectId to string
        for car in cars:
            car['_id'] = str(car['_id'])
            if 'created_at' in car:
                car['created_at'] = car['created_at'].isoformat()
            if 'updated_at' in car:
                car['updated_at'] = car['updated_at'].isoformat()
        
        return jsonify({
            "success": True,
            "count": len(cars),
            "cars": cars
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
