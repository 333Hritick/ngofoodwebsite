from django.contrib.auth import get_user_model
import os

User = get_user_model()

email = "hritickkumar3138@gmail.com"
password = "3138hritick@2626"

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(
        email=email,
        password=password
    )
    print("Superuser created")
else:
    print("Superuser already exists")