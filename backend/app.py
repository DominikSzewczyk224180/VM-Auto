from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from config import Config
from routes.cars import cars_bp
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for GitHub Pages frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# MongoDB connection
try:
    client = MongoClient(app.config['MONGODB_URI'])
    db = client[app.config['DATABASE_NAME']]
    # Test connection
    client.server_info()
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    db = None

# Make db available to routes
app.db = db

# Register blueprints
app.register_blueprint(cars_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({
        "message": "VM Auto Backend API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "cars": "/api/cars",
            "add_car": "/api/cars (POST)",
            "get_car": "/api/cars/<car_id>",
            "health": "/api/health"
        }
    })

@app.route('/api/health')
def health_check():
    mongodb_status = "connected" if db is not None else "disconnected"
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": mongodb_status
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
