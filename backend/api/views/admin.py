from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User, FoodDonation, Pickup, VolunteerProfile
from api.serializers import UserSerializer, FoodDonationSerializer
from api.permissions import IsAdmin
from api.serializers.pickup_serializers import PickupSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import NGOProfile
from rest_framework.permissions import IsAdminUser
from rest_framework import status


# ADMIN DASHBOARD STATS
class AdminStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):

        total_donations = FoodDonation.objects.count()

        active_ngos = User.objects.filter(
            role="ngo",
            is_active=True
        ).count()

        pending_pickups = Pickup.objects.filter(
            donation__status="claimed"
        ).count()

        available_donations = FoodDonation.objects.filter(
            status="available"
        ).count()

        delivered_donations = FoodDonation.objects.filter(
            status="delivered"
        ).count()

        total_donors = User.objects.filter(
            role="donor",
            is_active=True
        ).count()

        return Response({
            "total_donations": total_donations,
            "active_ngos": active_ngos,
            "pending_pickups": pending_pickups,
            "available_donations": available_donations,
            "delivered_donations": delivered_donations,
            "total_donors": total_donors
        })


# ADMIN USERS
class AdminUsersView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):

        role = request.query_params.get("role")

        users = User.objects.all().select_related("profile")

        if role:
            users = users.filter(role=role)

        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)


# ADMIN DONATIONS
class AdminDonationsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):

        status_filter = request.query_params.get("status")
        donor_id = request.query_params.get("donor_id")

        donations = FoodDonation.objects.all().select_related(
            "donor",
            "donor__profile"
        )

        if status_filter:
            donations = donations.filter(status=status_filter)

        if donor_id:
            donations = donations.filter(donor_id=donor_id)

        serializer = FoodDonationSerializer(donations, many=True, context={'request': request})

        return Response(serializer.data)


# ADMIN LOGIN
class AdminLoginView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user and user.is_superuser:

            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username
            })

        return Response(
            {"error": "Invalid admin credentials"},
            status=401
        )


class AdminPickupsView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        pickups = Pickup.objects.select_related(
            "donation",
            "donation__donor",
            "ngo"
        )

        serializer = PickupSerializer(pickups, many=True)

        return Response(serializer.data)        
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_ngos(request):

    print("USER:", request.user)

    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)

    ngos = NGOProfile.objects.all().order_by("-id")

    data = []

    for ngo in ngos:
        certificate_url = None

        if ngo.registration_certificate:
            print("FILE URL:", ngo.registration_certificate.url)

            certificate_url = request.build_absolute_uri(
                ngo.registration_certificate.url
            )

        data.append({
            "id": ngo.id,
            "email": ngo.user.email,
            "organization_name": ngo.organization_name,
            "registration_number": ngo.ngo_registration_number,
            "status": ngo.status,
            "is_verified": ngo.is_verified,
            "ai_trust_score": ngo.ai_trust_score,
            "ai_verified": ngo.ai_verified,
            "ai_analysis": ngo.ai_analysis,
            "registration_certificate": certificate_url,
        })

    return Response(data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_ngo(request, ngo_id):

    print("USER:", request.user)
    print("IS SUPERUSER:", request.user.is_superuser)

    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)

    ngo = NGOProfile.objects.get(id=ngo_id)

    ngo.status = "approved"
    ngo.is_verified = True
    ngo.save()

    return Response({"message": "Approved"})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_ngo(request, ngo_id):

    if not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=403)

    ngo = NGOProfile.objects.get(id=ngo_id)

    ngo.status = "rejected"
    ngo.is_verified = False
    ngo.save()

    return Response({"message": "NGO Rejected"})



class AdminVolunteerRequests(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        volunteers = VolunteerProfile.objects.filter(is_volunteer=True)

        data = [
            {
                "id": volunteer.id,
                "name": volunteer.name,
                "email": volunteer.email,
                "phone": volunteer.phone,
                "city": volunteer.city,
                "availability": volunteer.availability,
                "volunteer_status": volunteer.volunteer_status,
                "id_proof": volunteer.id_proof.url if volunteer.id_proof else None,
            }
            for volunteer in volunteers
        ]

        return Response(data)



class ApproveVolunteerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        action = request.data.get('action')

        user = User.objects.get(id=user_id)

        if action == 'approve':
            user.volunteer_status = 'approved'
        else:
            user.volunteer_status = 'rejected'

        user.save()

        return Response({'message': 'Volunteer status updated'})
    


class UpdateVolunteerStatus(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, id):
        try:
            volunteer = VolunteerProfile.objects.get(id=id)

            new_status = request.data.get("volunteer_status")

            if new_status not in ["approved", "rejected", "pending"]:
                return Response(
                    {"error": "Invalid status"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            volunteer.volunteer_status = new_status
            volunteer.save()

            return Response(
                {
                    "message": f"Volunteer status updated to {new_status}"
                },
                status=status.HTTP_200_OK
            )

        except VolunteerProfile.DoesNotExist:
            return Response(
                {"error": "Volunteer not found"},
                status=status.HTTP_404_NOT_FOUND
            )