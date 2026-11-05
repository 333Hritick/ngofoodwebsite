import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "foodshare_api.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

user = User.objects.get(username="hritick3138kumar")

user.set_password("3138hritick@2626")
user.is_superuser = True
user.is_staff = True
user.save()


