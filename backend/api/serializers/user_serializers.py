from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from api.models import User, Profile, NGOProfile
from api.services.ai_ngo_verifier import verify_ngo_ai



# ==============================
# Profile Serializer
# ==============================
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id',
            'full_name',
            'phone',
            'address',
            'organization_name',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ==============================
# User Serializer
# ==============================
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "role", "full_name"]

    def get_full_name(self, obj):
        profile = getattr(obj, "profile", None)
        return profile.full_name if profile else obj.email

# ==============================
# Register Serializer
# ==============================
class RegisterSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    full_name = serializers.CharField(required=True, max_length=255)
    role = serializers.ChoiceField(choices=['donor', 'ngo'], required=True)

    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    address = serializers.CharField(required=False, allow_blank=True)
    organization_name = serializers.CharField(required=False, allow_blank=True, max_length=255)

    ngo_registration_number = serializers.CharField(required=False, allow_blank=True)
    registration_certificate = serializers.FileField(required=False)

    # ==============================
    # Email Validation
    # ==============================
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value.lower()

    # ==============================
    # Role Validation
    # ==============================
    def validate(self, attrs):
        if attrs.get('role') == 'ngo' and not attrs.get('organization_name'):
            raise serializers.ValidationError({
                'organization_name': 'Organization name is required for NGO accounts.'
            })
        return attrs

    # ==============================
    # CREATE USER + PROFILE UPDATE + NGO PROFILE
    # ==============================
    def create(self, validated_data):

        role = validated_data.get("role")

        # Extract profile data
        full_name = validated_data.pop('full_name')
        phone = validated_data.pop('phone', None)
        address = validated_data.pop('address', None)
        organization_name = validated_data.pop('organization_name', None)

        # NGO fields
        ngo_registration_number = validated_data.pop('ngo_registration_number', None)
        registration_certificate = validated_data.pop('registration_certificate', None)

        #  Create user
        user = User.objects.create_user(
            username=validated_data['email'].split('@')[0],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role
        )

        #  Update profile (created by signal)
        profile = getattr(user, "profile", None)
        if profile:
            profile.full_name = full_name
            profile.phone = phone
            profile.address = address
            profile.organization_name = organization_name
            profile.save()

        #  NGO PROFILE + AI VERIFY
        if role == "ngo":
            certificate = self.context["request"].FILES.get(
                "registration_certificate"
            )

            print("FILES:", self.context["request"].FILES)
            print("CERTIFICATE:", certificate)

            ngo_profile = NGOProfile.objects.create(
                user=user,
                organization_name=organization_name,
                ngo_registration_number=ngo_registration_number,
                registration_certificate=certificate,
            )

            try:
                result = verify_ngo_ai(
                    ngo_profile.organization_name,
                    ngo_profile.ngo_registration_number
                )

                ngo_profile.ai_trust_score = result.get("confidence", 0)
                ngo_profile.ai_analysis = result.get("reason", "")
                ngo_profile.ai_verified = result.get("is_realistic", False)

                ngo_profile.save()

            except Exception as e:
                print("AI verification failed:", e)

        return user