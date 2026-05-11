from rest_framework import serializers
from api.models import User, VolunteerProfile

class VolunteerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerProfile
        fields = [
            'name',
            'email',
            'phone',
            'city',
            'availability',
            'id_proof'
        ]