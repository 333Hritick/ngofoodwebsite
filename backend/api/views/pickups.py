from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from api.models import Pickup, FoodDonation, TrackingUpdate
from api.serializers import PickupSerializer
from api.permissions import IsNGO

import random
import resend
import os

# ✅ Resend API Key
resend.api_key = os.getenv("RESEND_API_KEY")


# =========================
# VIEW PICKUPS
# =========================
class PickupViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PickupSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == 'ngo':
            return Pickup.objects.filter(
                ngo=user
            ).select_related(
                'donation__donor__profile',
                'ngo__profile'
            )

        elif user.role == 'donor':
            return Pickup.objects.filter(
                donation__donor=user
            ).select_related(
                'donation__donor__profile',
                'ngo__profile'
            )

        elif user.role == 'admin':
            return Pickup.objects.all().select_related(
                'donation__donor__profile',
                'ngo__profile'
            )

        return Pickup.objects.none()

    def get_serializer_context(self):
        return {"request": self.request}


# =========================
# CLAIM DONATION
# =========================
class ClaimDonationView(APIView):
    permission_classes = [IsNGO]

    @transaction.atomic
    def post(self, request):

        donation_id = request.data.get('donation_id')

        if not donation_id:
            return Response(
                {'error': 'donation_id required'},
                status=400
            )

        try:
            donation = FoodDonation.objects.select_for_update().get(
                id=donation_id
            )

        except FoodDonation.DoesNotExist:
            return Response(
                {'error': 'Donation not found'},
                status=404
            )

        if donation.status != 'available':
            return Response(
                {'error': 'Donation not available'},
                status=400
            )

        # ✅ Generate OTP
        otp = str(random.randint(100000, 999999))

        donation.otp_code = otp
        donation.status = "claimed"
        donation.save()

        # ✅ Create Pickup
        pickup = Pickup.objects.create(
            donation=donation,
            ngo=request.user
        )

        # ✅ Send OTP Email using Resend
        try:
            print("===== RESEND EMAIL START =====")
            print("RESEND API KEY:", os.getenv("RESEND_API_KEY"))
            print("DONOR EMAIL:", donation.donor.email)

            r = resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to":  "donation.donor.email",
                "subject": "FoodShare Pickup OTP",
                "text":f"Your OTP for pickup is: {otp}"
            })

            print("EMAIL SENT:", r)

        except Exception as e:
            print("EMAIL ERROR:", repr(e))

        print("===== RESEND EMAIL END =====")

        # ✅ Tracking
        ngo_profile = getattr(request.user, "profile", None)

        ngo_name = (
            ngo_profile.organization_name
            if ngo_profile and ngo_profile.organization_name
            else request.user.email
        )

        TrackingUpdate.objects.create(
            pickup=pickup,
            status='claimed',
            message=f'Claimed by {ngo_name}',
            created_by=request.user
        )

        # ✅ Serializer
        serializer = PickupSerializer(
            pickup,
            context={"request": request}
        )

        return Response(serializer.data, status=201)


# =========================
# VERIFY OTP
# =========================
class VerifyDonationOTPView(APIView):
    permission_classes = [IsNGO]

    @transaction.atomic
    def post(self, request):

        donation_id = request.data.get("donation_id")
        otp = request.data.get("otp")

        if not donation_id or not otp:
            return Response(
                {"error": "donation_id and otp required"},
                status=400
            )

        try:
            donation = FoodDonation.objects.select_for_update().get(
                id=donation_id,
                pickup__ngo=request.user
            )

        except FoodDonation.DoesNotExist:
            return Response(
                {"error": "Donation not found or not yours"},
                status=404
            )

        if donation.status != "claimed":
            return Response(
                {"error": "Invalid donation status"},
                status=400
            )

        if donation.otp_code != otp:
            return Response(
                {"error": "Invalid OTP"},
                status=400
            )

        # ✅ OTP Verified
        donation.status = "picked_up"
        donation.otp_verified = True
        donation.otp_code = None
        donation.save()

        TrackingUpdate.objects.create(
            pickup=donation.pickup,
            status='picked_up',
            message='Food picked up successfully',
            created_by=request.user
        )

        return Response(
            {"message": "Pickup successful"},
            status=200
        )