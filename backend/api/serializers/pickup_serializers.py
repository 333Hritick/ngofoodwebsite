from rest_framework import serializers
from api.models import Pickup
from .donation_serializers import FoodDonationSerializer


class PickupSerializer(serializers.ModelSerializer):
    donation = serializers.SerializerMethodField()
    donor_name = serializers.SerializerMethodField()
    status = serializers.CharField(source='donation.status', read_only=True)
    ngo_name = serializers.SerializerMethodField()

    class Meta:
        model = Pickup
        fields = ['id', 'donation', 'donor_name','ngo_name', 'status', 'claimed_at']

    def get_donation(self, obj):
        return FoodDonationSerializer(
            obj.donation,
            context=self.context
        ).data

    def get_donor_name(self, obj):
        profile = getattr(obj.donation.donor, "profile", None)
        return profile.full_name if profile and profile.full_name else obj.donation.donor.email
    


    def get_ngo_name(self, obj):
        profile = getattr(obj.ngo, "profile", None)
        return profile.organization_name if profile else obj.ngo.email