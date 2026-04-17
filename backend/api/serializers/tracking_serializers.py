from rest_framework import serializers
from api.models import TrackingUpdate


class TrackingUpdateSerializer(serializers.ModelSerializer):
    """Serializer for tracking updates"""
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = TrackingUpdate
        fields = ['id', 'pickup', 'status', 'message', 'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_by_name', 'created_at']
    
    def get_created_by_name(self, obj):
        """Get name of user who created the update"""
        if obj.created_by:
            if hasattr(obj.created_by, 'profile'):
                if obj.created_by.role == 'ngo' and obj.created_by.profile.organization_name:
                    return obj.created_by.profile.organization_name
                return obj.created_by.profile.full_name
            return obj.created_by.email
        return 'System'
