import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "foodshare_api.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

user = User.objects.get(username="santosh123")

user.set_password("12345678")
user.is_superuser = True
user.is_staff = True
user.save()

print("PASSWORD SET TO 12345678")
