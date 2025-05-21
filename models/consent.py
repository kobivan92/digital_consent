from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Any, Optional

@dataclass
class ConsentRequest:
    third_party_id: str
    data_types: List[str]
    purpose: str

@dataclass
class Consent:
    user_id: str
    third_party_id: str
    data_types: List[str]
    purpose: str
    granted_at: datetime
    status: str
    id: Optional[str] = None
    revoked_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert consent object to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'third_party_id': self.third_party_id,
            'data_types': self.data_types,
            'purpose': self.purpose,
            'granted_at': self.granted_at.isoformat(),
            'status': self.status,
            'revoked_at': self.revoked_at.isoformat() if self.revoked_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Consent':
        """Create consent object from dictionary."""
        return cls(
            id=data.get('id'),
            user_id=data['user_id'],
            third_party_id=data['third_party_id'],
            data_types=data['data_types'],
            purpose=data['purpose'],
            granted_at=datetime.fromisoformat(data['granted_at']),
            status=data['status'],
            revoked_at=datetime.fromisoformat(data['revoked_at']) if data.get('revoked_at') else None
        ) 