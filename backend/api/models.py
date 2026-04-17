from django.contrib.auth.models import AbstractUser
from django.db import models
import random
from django.db.models.signals import post_save
from django.dispatch import receiver


# ==============================
# USER MODEL
# ==============================
class User(AbstractUser):

    ROLE_CHOICES = [
        ('donor', 'Donor'),
        ('ngo', 'NGO'),
        ('admin', 'Admin'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='donor')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


# ==============================
# PROFILE
# ==============================
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    organization_name = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# ==============================
# FOOD DONATION
# ==============================
class FoodDonation(models.Model):

    FOOD_TYPE_CHOICES = [
        ('cooked', 'Cooked Food'),
        ('packaged', 'Packaged Food'),
        ('fresh_produce', 'Fresh Produce'),
        ('baked', 'Baked Goods'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('claimed', 'Claimed'),
        ('picked_up', 'Picked Up'),
        ('delivered', 'Delivered'),
    ]

    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')

    title = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.CharField(max_length=100)
    food_type = models.CharField(max_length=20, choices=FOOD_TYPE_CHOICES, default='cooked')
    expiry_time = models.DateTimeField()
    pickup_address = models.TextField()

    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_verified = models.BooleanField(default=False)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def generate_otp(self):
        self.otp_code = str(random.randint(100000, 999999))

    def __str__(self):
        return f"{self.title} by {self.donor.email}"


# ==============================
# PICKUP
# ==============================
class Pickup(models.Model):
    donation = models.OneToOneField(FoodDonation, on_delete=models.CASCADE, related_name='pickup')
    ngo = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pickups')
    claimed_at = models.DateTimeField(auto_now_add=True)


# ==============================
# TRACKING UPDATE
# ==============================
class TrackingUpdate(models.Model):
    pickup = models.ForeignKey(Pickup, on_delete=models.CASCADE, related_name='tracking_updates')
    status = models.CharField(max_length=20)
    message = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']


# ==============================
# NGO PROFILE
# ==============================
class NGOProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization_name = models.CharField(max_length=200)
    ngo_registration_number = models.CharField(max_length=100)
    registration_certificate = models.FileField(upload_to="ngo_docs/")
    is_verified = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=[("pending","Pending"),("approved","Approved"),("rejected","Rejected")],
        default="pending"
    )

    ai_trust_score = models.IntegerField(default=0)
    ai_verified = models.BooleanField(default=False)
    ai_analysis = models.TextField(blank=True, null=True)


# ==============================
# SIGNAL (FIXED + SAFE)
# ==============================
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)   


class VolunteerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="volunteer_profile")

    is_volunteer = models.BooleanField(default=False)

    volunteer_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected')
        ],
        default='pending'
    )
    name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)

    city = models.CharField(max_length=100, blank=True)
    id_proof = models.FileField(upload_to='volunteer_ids/', blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True)