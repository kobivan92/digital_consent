from typing import List, Dict, Any
from services.solid_service import SolidService
from services.consent_service import ConsentService

class DataService:
    def __init__(self):
        self.solid_service = SolidService()
        self.consent_service = ConsentService()
    
    def get_user_data(self, user_id: str, data_type: str = None) -> Dict[str, Any]:
        """Retrieve user data from SOLID POD."""
        if data_type:
            return self.solid_service.get_data(user_id, data_type)
        return self.solid_service.get_all_data(user_id)
    
    def update_user_data(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user data in SOLID POD."""
        # Validate data structure
        self._validate_data(data)
        
        # Update data in SOLID POD
        self.solid_service.update_data(user_id, data)
        
        return {
            'status': 'success',
            'message': 'Data updated successfully',
            'updated_fields': list(data.keys())
        }
    
    def create_data_request(
        self,
        requester_id: str,
        user_id: str,
        data_types: List[str],
        purpose: str
    ) -> Dict[str, Any]:
        """Create a new data access request."""
        request = {
            'requester_id': requester_id,
            'user_id': user_id,
            'data_types': data_types,
            'purpose': purpose,
            'status': 'pending',
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Store request in SOLID POD
        self.solid_service.store_data_request(request)
        
        return {
            'request_id': request['id'],
            'status': 'pending',
            'message': 'Data access request created'
        }
    
    def _validate_data(self, data: Dict[str, Any]) -> None:
        """Validate data structure before storage."""
        required_fields = ['type', 'value']
        
        for field, value in data.items():
            if not isinstance(value, dict):
                raise ValueError(f'Invalid data structure for field: {field}')
            
            for req_field in required_fields:
                if req_field not in value:
                    raise ValueError(f'Missing required field {req_field} in {field}')
            
            if value['type'] not in ['string', 'number', 'boolean', 'array', 'object']:
                raise ValueError(f'Invalid data type: {value["type"]}') 