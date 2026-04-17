from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.db.models import Q

from api.models import FoodDonation
from api.serializers import FoodDonationSerializer
from api.permissions import IsDonor, IsOwnerOrReadOnly


class FoodDonationViewSet(viewsets.ModelViewSet):
    serializer_class = FoodDonationSerializer
    permission_classes = [IsAuthenticated]

    # ✅ Proper role-based queryset (FIXED)
    def get_queryset(self):
        user = self.request.user
        print("CURRENT USER:", user.email, user.role)

        base_queryset = FoodDonation.objects.select_related(
            "donor",
            "donor__profile"
        ).order_by('-id')  # 🔥 latest first

        # ✅ Donor view (ONLY their donations)
        if user.role and user.role.lower() == 'donor':
            print("DONOR MATCH")
            return base_queryset.filter(donor__id=user.id)

        # ✅ NGO view (available + claimed by them)
        elif user.role and user.role.lower() == 'ngo':
            print("NGO MATCH")
            return base_queryset.filter(
                Q(status='available') | Q(pickup__ngo=user)
            ).distinct()

        # ✅ Admin view (all data)
        elif user.role and user.role.lower() == 'admin':
            print("ADMIN MATCH")
            return base_queryset.all()

        print("NO MATCH ❌")
        return FoodDonation.objects.none()

    # ✅ Role-based permissions
    def get_permissions(self):
        if self.action == 'create':
            return [IsDonor()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsOwnerOrReadOnly()]
        return [IsAuthenticated()]

    # ✅ Auto assign donor
    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

    # ✅ Prevent delete after claim
    def destroy(self, request, *args, **kwargs):
     instance = self.get_object()

    # ✅ safety check
     if not instance.donor:
        return Response(
            {'error': 'Donation has no donor assigned'},
            status=status.HTTP_400_BAD_REQUEST
        )

     if instance.status != 'available':
        return Response(
            {'error': 'Cannot delete donation that has been claimed'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ SAFE comparison
     if instance.donor_id != request.user.id:
        return Response(
            {'error': 'You can only delete your own donations'},
            status=status.HTTP_403_FORBIDDEN
        )

     self.perform_destroy(instance)
     return Response(status=status.HTTP_204_NO_CONTENT)
    # ✅ Available donations endpoint
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def available(self, request):
        donations = FoodDonation.objects.select_related(
            "donor",
            "donor__profile"
        ).filter(status='available').order_by('-id')

        serializer = self.get_serializer(donations, many=True)
        return Response(serializer.data)


# ✅ NGO Donation List View (optional)
class NGODonationListView(ListAPIView):
    serializer_class = FoodDonationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FoodDonation.objects.all().order_by('-id')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context