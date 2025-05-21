from typing import Dict, List, Any, Optional
from datetime import datetime
import uuid
from solid_auth_client import SolidAuthClient
from solid_pod import SolidPod

class SolidService:
    def __init__(self):
        self.auth_client = SolidAuthClient()
        self.pod = SolidPod()
    
    def authenticate(self, username: str, password: str) -> Optional[str]:
        """Authenticate user with SOLID POD."""
        try:
            token = self.auth_client.login(username, password)
            return token
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return None
    
    def register_user(self, username: str, password: str, email: str) -> bool:
        """Register a new user with SOLID POD."""
        try:
            self.pod.create_user(username, password, email)
            return True
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return False
    
    def logout(self) -> None:
        """Logout from SOLID POD."""
        self.auth_client.logout()
    
    def store_consent(self, consent: 'Consent') -> None:
        """Store consent record in SOLID POD."""
        consent.id = str(uuid.uuid4())
        self.pod.store_document(
            f"consents/{consent.id}",
            consent.to_dict()
        )
    
    def get_consent(self, consent_id: str) -> Optional['Consent']:
        """Retrieve consent record from SOLID POD."""
        try:
            data = self.pod.get_document(f"consents/{consent_id}")
            return Consent.from_dict(data)
        except Exception:
            return None
    
    def update_consent(self, consent: 'Consent') -> None:
        """Update consent record in SOLID POD."""
        self.pod.update_document(
            f"consents/{consent.id}",
            consent.to_dict()
        )
    
    def get_user_consents(self, user_id: str) -> List['Consent']:
        """Get all consent records for a user."""
        try:
            consents = self.pod.query_documents(
                "consents",
                {"user_id": user_id}
            )
            return [Consent.from_dict(c) for c in consents]
        except Exception:
            return []
    
    def get_data(self, user_id: str, data_type: str) -> Dict[str, Any]:
        """Get specific data type for user."""
        try:
            return self.pod.get_document(f"data/{user_id}/{data_type}")
        except Exception:
            return {}
    
    def get_all_data(self, user_id: str) -> Dict[str, Any]:
        """Get all data for user."""
        try:
            return self.pod.get_document(f"data/{user_id}")
        except Exception:
            return {}
    
    def update_data(self, user_id: str, data: Dict[str, Any]) -> None:
        """Update user data in SOLID POD."""
        self.pod.update_document(f"data/{user_id}", data)
    
    def store_data_request(self, request: Dict[str, Any]) -> None:
        """Store data access request in SOLID POD."""
        request['id'] = str(uuid.uuid4())
        self.pod.store_document(
            f"requests/{request['id']}",
            request
        ) 