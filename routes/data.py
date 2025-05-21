from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.data_service import DataService
from services.consent_service import ConsentService

data_bp = Blueprint('data', __name__)
data_service = DataService()
consent_service = ConsentService()

@data_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_data():
    user_id = get_jwt_identity()
    data_type = request.args.get('type')
    
    data = data_service.get_user_data(user_id, data_type)
    return jsonify(data), 200

@data_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_third_party_data(user_id):
    requester_id = get_jwt_identity()
    data_type = request.args.get('type')
    
    # Verify consent
    if not consent_service.verify_consent(user_id, requester_id, data_type):
        return jsonify({'error': 'No valid consent found'}), 403
    
    data = data_service.get_user_data(user_id, data_type)
    return jsonify(data), 200

@data_bp.route('/update', methods=['POST'])
@jwt_required()
def update_user_data():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    result = data_service.update_user_data(user_id, data)
    return jsonify(result), 200

@data_bp.route('/request', methods=['POST'])
@jwt_required()
def request_data_access():
    requester_id = get_jwt_identity()
    data = request.get_json()
    
    result = data_service.create_data_request(
        requester_id,
        data['user_id'],
        data['data_types'],
        data['purpose']
    )
    return jsonify(result), 201 