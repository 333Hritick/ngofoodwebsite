from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from api.models import User, Profile, FoodDonation, Pickup, TrackingUpdate
from .models import NGOProfile
from rest_framework.permissions import IsAdminUser
from api.models import NGOProfile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin



@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for custom User model"""
    list_display = ['email', 'username', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'username']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role',)}),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Admin configuration for Profile model"""
    list_display = ['full_name', 'user', 'phone', 'organization_name', 'created_at']
    search_fields = ['full_name', 'user__email', 'organization_name']
    list_filter = ['created_at']
    ordering = ['-created_at']


@admin.register(FoodDonation)
class FoodDonationAdmin(admin.ModelAdmin):
    """Admin configuration for FoodDonation model"""
    list_display = ['title', 'donor', 'food_type', 'status', 'expiry_time', 'created_at']
    list_filter = ['status', 'food_type', 'created_at']
    search_fields = ['title', 'description', 'donor__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Pickup)
class PickupAdmin(admin.ModelAdmin):
    """Admin configuration for Pickup model"""
    list_display = ['donation', 'ngo', 'claimed_at']
    list_filter = ['claimed_at']
    search_fields = ['donation__title', 'ngo__email']
    ordering = ['-claimed_at']
    readonly_fields = ['claimed_at']


@admin.register(TrackingUpdate)
class TrackingUpdateAdmin(admin.ModelAdmin):
    """Admin configuration for TrackingUpdate model"""
    list_display = ['pickup', 'status', 'message', 'created_by', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['message', 'pickup__donation__title']
    ordering = ['created_at']
    readonly_fields = ['created_at']




@admin.register(NGOProfile)
class NGOProfileAdmin(admin.ModelAdmin):

    list_display = ("organization_name", "user", "status", "is_verified")
    list_filter = ("status", "is_verified")
    list_editable = ("status", "is_verified")

    actions = ["approve_ngos"]

    def approve_ngos(self, request, queryset):
        queryset.update(is_verified=True, status="approved")

    approve_ngos.short_description = "Approve selected NGOs"    


class AIVerifyNGOView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        from api.services.ai_ngo_verifier import verify_ngo_ai  
        from api.models import NGOProfile

        ngo_id = request.data.get("ngo_id")
        ngo = NGOProfile.objects.get(id=ngo_id)

        result = verify_ngo_ai(
            ngo.organization_name,
            ngo.ngo_registration_number
        )
        ngo.ai_trust_score = result["confidence"]
        ngo.ai_analysis = result["reason"]
        ngo.ai_verified = result["is_realistic"]

        ngo.save()

        return Response({"ai_result": result})
    

