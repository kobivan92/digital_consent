from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.consent_service import ConsentService
from models.consent import ConsentRequest

consent_bp = Blueprint('consent', __name__)
consent_service = ConsentService()

@consent_bp.route('/grant', methods=['POST'])
@jwt_required()
def grant_consent():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    consent_request = ConsentRequest(
        third_party_id=data['third_party_id'],
        data_types=data['data_types'],
        purpose=data['purpose']
    )
    
    result = consent_service.grant_consent(user_id, consent_request)
    return jsonify(result), 201

@consent_bp.route('/revoke', methods=['POST'])
@jwt_required()
def revoke_consent():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    result = consent_service.revoke_consent(
        user_id,
        data['third_party_id'],
        data['consent_id']
    )
    return jsonify(result), 200

@consent_bp.route('/history', methods=['GET'])
@jwt_required()
def get_consent_history():
    user_id = get_jwt_identity()
    history = consent_service.get_consent_history(user_id)
    return jsonify(history), 200

@consent_bp.route('/status', methods=['GET'])
@jwt_required()
def get_consent_status():
    user_id = get_jwt_identity()
    third_party_id = request.args.get('third_party_id')
    
    status = consent_service.get_consent_status(user_id, third_party_id)
    return jsonify(status), 200 