from datetime import datetime
from models.consent import Consent, ConsentRequest
from services.solid_service import SolidService

class ConsentService:
    def __init__(self):
        self.solid_service = SolidService()
    
    def grant_consent(self, user_id: str, consent_request: ConsentRequest) -> dict:
        """Grant consent to a third party for specific data types."""
        consent = Consent(
            user_id=user_id,
            third_party_id=consent_request.third_party_id,
            data_types=consent_request.data_types,
            purpose=consent_request.purpose,
            granted_at=datetime.utcnow(),
            status='active'
        )
        
        # Store consent in SOLID POD
        self.solid_service.store_consent(consent)
        
        return {
            'consent_id': consent.id,
            'status': 'granted',
            'granted_at': consent.granted_at.isoformat()
        }
    
    def revoke_consent(self, user_id: str, third_party_id: str, consent_id: str) -> dict:
        """Revoke previously granted consent."""
        consent = self.solid_service.get_consent(consent_id)
        
        if not consent or consent.user_id != user_id:
            raise ValueError('Consent not found or unauthorized')
        
        consent.status = 'revoked'
        consent.revoked_at = datetime.utcnow()
        
        # Update consent in SOLID POD
        self.solid_service.update_consent(consent)
        
        return {
            'consent_id': consent.id,
            'status': 'revoked',
            'revoked_at': consent.revoked_at.isoformat()
        }
    
    def get_consent_history(self, user_id: str) -> list:
        """Get all consent records for a user."""
        return self.solid_service.get_user_consents(user_id)
    
    def get_consent_status(self, user_id: str, third_party_id: str) -> dict:
        """Get current consent status for a third party."""
        consents = self.solid_service.get_user_consents(user_id)
        active_consents = [
            c for c in consents 
            if c.third_party_id == third_party_id and c.status == 'active'
        ]
        
        return {
            'has_consent': len(active_consents) > 0,
            'active_consents': [
                {
                    'consent_id': c.id,
                    'data_types': c.data_types,
                    'purpose': c.purpose,
                    'granted_at': c.granted_at.isoformat()
                }
                for c in active_consents
            ]
        }
    
    def verify_consent(self, user_id: str, third_party_id: str, data_type: str) -> bool:
        """Verify if valid consent exists for specific data type."""
        consents = self.solid_service.get_user_consents(user_id)
        return any(
            c.third_party_id == third_party_id 
            and c.status == 'active' 
            and data_type in c.data_types
            for c in consents
        ) 