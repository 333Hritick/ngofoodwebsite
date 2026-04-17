from rest_framework import serializers
from api.models import FoodDonation


class FoodDonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.SerializerMethodField()
    donor_email = serializers.SerializerMethodField()
    donor_phone = serializers.SerializerMethodField()
    donor_address = serializers.SerializerMethodField()

    class Meta:
        model = FoodDonation
        fields = "__all__"
        read_only_fields = ["donor"]

    # ✅ Donor Name
    def get_donor_name(self, obj):
        profile = getattr(obj.donor, "profile", None)
        return profile.full_name if profile and profile.full_name else obj.donor.email

    # ✅ Donor Email
    def get_donor_email(self, obj):
        return obj.donor.email

    # ✅ Donor Phone
    def get_donor_phone(self, obj):
        profile = getattr(obj.donor, "profile", None)
        return profile.phone if profile else None

    # ✅ Donor Address
    def get_donor_address(self, obj):
        return obj.pickup_address