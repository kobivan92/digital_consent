from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from services.auth_service import AuthService
from services.solid_service import SolidService

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()
solid_service = SolidService()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Authenticate with SOLID POD
    solid_token = solid_service.authenticate(
        data['username'],
        data['password']
    )
    
    if not solid_token:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Create JWT token
    access_token = create_access_token(identity=data['username'])
    
    return jsonify({
        'access_token': access_token,
        'solid_token': solid_token
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Register with SOLID POD
    result = solid_service.register_user(
        data['username'],
        data['password'],
        data['email']
    )
    
    if not result:
        return jsonify({'error': 'Registration failed'}), 400
    
    return jsonify({'message': 'Registration successful'}), 201

@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Clear SOLID session
    solid_service.logout()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    is_valid = auth_service.verify_token(token)
    if not is_valid:
        return jsonify({'error': 'Invalid token'}), 401
    
    return jsonify({'message': 'Token is valid'}), 200 