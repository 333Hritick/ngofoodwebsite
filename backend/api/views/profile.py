from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.serializers import ProfileSerializer, UserSerializer
from api.models import Profile

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        # ✅ SAFE PROFILE FETCH
        profile = getattr(request.user, "profile", None)

        # ✅ CREATE IF NOT EXISTS
        if not profile:
            profile = Profile.objects.create(user=request.user)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)