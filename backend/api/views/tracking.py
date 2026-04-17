from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from api.models import TrackingUpdate, Pickup, FoodDonation
from api.serializers import TrackingUpdateSerializer
from api.permissions import IsNGO


class TrackingUpdateView(APIView):
    """Get tracking updates for a donation"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, donation_id):
        try:
            donation = FoodDonation.objects.get(id=donation_id)
        except FoodDonation.DoesNotExist:
            return Response(
                {'error': 'Donation not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user has access to this donation
        user = request.user
        if user.role == 'donor' and donation.donor != user:
            return Response(
                {'error': 'You do not have permission to view this tracking'},
                status=status.HTTP_403_FORBIDDEN
            )
        elif user.role == 'ngo':
            try:
                pickup = donation.pickup
                if pickup.ngo != user:
                    return Response(
                        {'error': 'You do not have permission to view this tracking'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except Pickup.DoesNotExist:
                return Response(
                    {'error': 'This donation has not been claimed yet'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Get tracking updates
        try:
            pickup = donation.pickup
            updates = TrackingUpdate.objects.filter(pickup=pickup).order_by('created_at')
            serializer = TrackingUpdateSerializer(updates, many=True)
            return Response(serializer.data)
        except Pickup.DoesNotExist:
            return Response({'updates': []})


class UpdateStatusView(APIView):
    """Update pickup status"""
    permission_classes = [IsNGO]
    
    @transaction.atomic
    def post(self, request):
        pickup_id = request.data.get('pickup_id')
        new_status = request.data.get('status')
        message = request.data.get('message', '')
        
        if not pickup_id or not new_status:
            return Response(
                {'error': 'pickup_id and status are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate status
        valid_statuses = ['picked_up', 'delivered']
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Status must be one of: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            pickup = Pickup.objects.select_for_update().get(id=pickup_id)
        except Pickup.DoesNotExist:
            return Response(
                {'error': 'Pickup not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user is the NGO that claimed this donation
        if pickup.ngo != request.user:
            return Response(
                {'error': 'You can only update pickups you have claimed'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if already delivered
        if pickup.donation.status == 'delivered':
            return Response(
                {'error': 'This pickup has already been delivered'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate status progression
        current_status = pickup.donation.status
        if current_status == 'available':
            return Response(
                {'error': 'Donation must be claimed before updating status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif current_status == 'delivered':
            return Response(
                {'error': 'Cannot update status of delivered donation'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update donation status
        pickup.donation.status = new_status
        pickup.donation.save()
        
        # Create tracking update
        ngo_name = request.user.profile.organization_name or request.user.profile.full_name
        if not message:
            if new_status == 'picked_up':
                message = f'Food picked up by {ngo_name}'
            elif new_status == 'delivered':
                message = f'Food delivered by {ngo_name}'
        
        tracking_update = TrackingUpdate.objects.create(
            pickup=pickup,
            status=new_status,
            message=message,
            created_by=request.user
        )
        
        serializer = TrackingUpdateSerializer(tracking_update)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
