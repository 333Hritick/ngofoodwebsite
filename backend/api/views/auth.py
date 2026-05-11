from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError
from api.serializers import RegisterSerializer, UserSerializer
from api.models import User, VolunteerProfile



class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("REQUEST DATA:", request.data)
            print(serializer.errors)
            return Response(serializer.errors, status=400)

        user = serializer.save()

        # NGO ko token mat do
        if user.role == "ngo":
            return Response({
                "message": "NGO registration submitted. Please wait for admin approval.",
                "user": UserSerializer(user).data,
            }, status=status.HTTP_201_CREATED)

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
        


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.check_password(password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # ⭐ NGO LOGIN BLOCK (FIXED INDENT)
        if user.role == "ngo":
            ngo_profile = getattr(user, "ngoprofile", None)

            # ❌ NGO profile missing
            if not ngo_profile:
                return Response(
                    {'error': 'NGO profile not found. Contact admin.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # ❌ NGO not approved
            if not ngo_profile.is_verified:
                return Response(
                    {'error': 'Your NGO is waiting for admin approval'},
                    status=status.HTTP_403_FORBIDDEN
                )

        # ✅ Token generate AFTER approval check
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    



class contactUsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        message = request.data.get("message")

        # Yahan aap apne contact form data ko process kar sakte hain
        # Jaise ki email bhejna ya database mein save karna

        return Response({"message": "Thank you for contacting us!"}, status=200)
    




class VolunteerRegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        user, created = User.objects.get_or_create(
            email=request.data.get("email"),
            defaults={
                "username": request.data.get("email"),
                "full_name": request.data.get("name"),
                "role": "volunteer"
            }
        )

        if created:
            user.set_password("temp12345")
            user.save()

        volunteer_profile, created = VolunteerProfile.objects.get_or_create(
            user=user
        )

        volunteer_profile.is_volunteer = True
        volunteer_profile.volunteer_status = "pending"
        volunteer_profile.name = request.data.get("name")
        volunteer_profile.email = request.data.get("email")
        volunteer_profile.phone = request.data.get("phone")
        volunteer_profile.city = request.data.get("city")
        volunteer_profile.availability = request.data.get("availability")

        if request.FILES.get("id_proof"):
            volunteer_profile.id_proof = request.FILES.get("id_proof")

        volunteer_profile.save()

        return Response(
            {"message": "Volunteer request submitted successfully"},
            status=status.HTTP_201_CREATED
        )