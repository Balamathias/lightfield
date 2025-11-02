"""
Quick script to create a superuser for testing
Run: python manage.py shell < create_superuser.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lightfield.settings')
django.setup()

from api.models import User

# Create superuser if it doesn't exist
username = 'admin'
email = 'admin@lightfield.com'
password = 'admin123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        first_name='Admin',
        last_name='User'
    )
    print(f'✅ Superuser created successfully!')
    print(f'Username: {username}')
    print(f'Password: {password}')
    print(f'Email: {email}')
else:
    print(f'⚠️  Superuser "{username}" already exists')
