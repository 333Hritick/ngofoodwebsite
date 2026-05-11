from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    RegisterView, LoginView, LogoutView, RefreshTokenView, CurrentUserView,
    ProfileView,
    FoodDonationViewSet,
    PickupViewSet, ClaimDonationView,
    TrackingUpdateView, UpdateStatusView,
    AdminStatsView, AdminUsersView, AdminDonationsView
)
from api.views.pickups import VerifyDonationOTPView
from api.views.admin import AdminLoginView, UpdateVolunteerStatus, reject_ngo
from api.admin import AIVerifyNGOView
from api.views.admin import AdminPickupsView
from api.views.admin import get_pending_ngos, approve_ngo   
from api.views.auth import VolunteerRegisterView, contactUsView
from api.views.admin import AdminVolunteerRequests
from api.views.admin import ApproveVolunteerView
# Router for viewsets
router = DefaultRouter()
router.register(r'donations', FoodDonationViewSet, basename='donation')
router.register(r'pickups', PickupViewSet, basename='pickup')

urlpatterns = [
    # Authentication endpoints
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('auth/refresh', RefreshTokenView.as_view(), name='token_refresh'),
    path('auth/me', CurrentUserView.as_view(), name='current_user'),
    path('auth/contact-us/', contactUsView.as_view(), name='contact_us'),
    path("volunteer/register/", VolunteerRegisterView.as_view()),
    # Profile endpoints
    path('profile', ProfileView.as_view(), name='profile'),
    
    # Pickup endpoints
    path('pickups/claim/', ClaimDonationView.as_view(), name='claim_donation'),
    path("pickups/verify-otp/", VerifyDonationOTPView.as_view()),
    
    # Tracking endpoints
    path('tracking/<int:donation_id>', TrackingUpdateView.as_view(), name='tracking_updates'),
    path('tracking/update', UpdateStatusView.as_view(), name='update_status'),
    
    # Admin endpoints
    path('admin-api/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('admin-api/users/', AdminUsersView.as_view(), name='admin_users'),
    path('admin-api/donations/', AdminDonationsView.as_view(), name='admin_donations'),
    path("admin-api/login/", AdminLoginView.as_view()),
    path("admin-api/pickups/", AdminPickupsView.as_view(), name="admin_pickups"),
    path('admin-api/ngos/', get_pending_ngos),
    path('admin-api/ngos/<int:ngo_id>/approve/', approve_ngo),
    path("admin-api/ngos/<int:ngo_id>/reject/", reject_ngo),
    path('admin-api/volunteers/', AdminVolunteerRequests.as_view()),
    path('volunteer/register/', VolunteerRegisterView.as_view(), name='volunteer_register'),
    path("admin-api/volunteers/<int:id>/status/",UpdateVolunteerStatus.as_view()),

    # Include router URLs
    path('', include(router.urls)),
    path("admin/ai-verify-ngo/", AIVerifyNGOView.as_view()),
]
