from rest_framework import serializers
from api.models import User

class VolunteerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'name',
            'email',
            'phone',
            'city',
            'availability',
            'id_proof'
        ]