from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Import and register blueprints
from routes.consent import consent_bp
from routes.data import data_bp
from routes.auth import auth_bp

app.register_blueprint(consent_bp, url_prefix='/api/consent')
app.register_blueprint(data_bp, url_prefix='/api/data')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

if __name__ == '__main__':
    app.run(debug=True) 