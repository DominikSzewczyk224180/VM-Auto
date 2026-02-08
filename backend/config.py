import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Flask configuration"""
    
    # MongoDB settings
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.environ.get('DATABASE_NAME', 'vm_auto_db')
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.environ.get('DEBUG', 'True') == 'True'
    
    # Autoplac.pl API settings (for future integration)
    AUTOPLAC_API_KEY = os.environ.get('AUTOPLAC_API_KEY', '')
    AUTOPLAC_API_URL = os.environ.get('AUTOPLAC_API_URL', 'https://api.autoplac.pl')
    
    # File upload settings
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
