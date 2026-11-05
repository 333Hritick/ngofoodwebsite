import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "foodshare_api.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

user = User.objects.get(username="santosh123")
user.set_password("Santosh@123")
user.save()

print("Password reset successfully")
