# Food Share Backend API

Django REST API backend for the Food Share platform - connecting food donors with NGOs to reduce food waste and fight hunger.

## Features

- **Role-based Authentication**: JWT-based authentication with three user roles (Donor, NGO, Admin)
- **User Management**: Registration, login, profile management
- **Food Donation System**: CRUD operations for food donations
- **Pickup Management**: NGO claims and tracking system
- **Status Tracking**: Real-time tracking of food donation lifecycle
- **Admin Dashboard**: Statistics and management tools

## Tech Stack

- Django 5.0.1
- Django REST Framework 3.14.0
- Simple JWT for authentication
- SQLite (development) / PostgreSQL (production ready)
- CORS Headers for frontend integration

## Installation

### Prerequisites

- Python 3.10 or higher
- pip

### Setup

1. **Clone the repository and navigate to backend**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**

Windows:
```bash
venv\Scripts\activate
```

Unix/MacOS:
```bash
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser (optional)**
```bash
python manage.py createsuperuser
```

7. **Run development server**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- Create a new user account
- Body:
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "role": "donor",
  "phone": "+1234567890",
  "address": "123 Main St",
  "organization_name": "Food Helpers"
}
```
- `organization_name` is required for NGO role
- Returns: User data with JWT tokens

#### Login
- **POST** `/api/auth/login`
- Authenticate user
- Body:
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```
- Returns: User data with JWT tokens

#### Logout
- **POST** `/api/auth/logout`
- Blacklist refresh token
- Requires: Authentication
- Body:
```json
{
  "refresh": "refresh_token_here"
}
```

#### Refresh Token
- **POST** `/api/auth/refresh`
- Get new access token
- Body:
```json
{
  "refresh": "refresh_token_here"
}
```
- Returns: New access token

#### Current User
- **GET** `/api/auth/me`
- Get current authenticated user profile
- Requires: Authentication
- Returns: User profile with role-specific data

### Profile

#### Get/Update Profile
- **GET** `/api/profile` - Get current user profile
- **PATCH** `/api/profile` - Update profile
- Requires: Authentication
- Body (PATCH):
```json
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address": "456 New St",
  "organization_name": "Updated NGO Name"
}
```

### Food Donations

#### List Donations
- **GET** `/api/donations`
- List donations based on user role
  - Donors: Their own donations
  - NGOs: Available donations + claimed ones
  - Admins: All donations
- Requires: Authentication

#### Create Donation
- **POST** `/api/donations`
- Create new food donation (Donor only)
- Requires: Authentication, Donor role
- Body:
```json
{
  "title": "Fresh Vegetables",
  "description": "10kg of fresh organic vegetables",
  "quantity": "Serves 20 people",
  "food_type": "fresh_produce",
  "expiry_time": "2026-01-30T18:00:00Z",
  "pickup_address": "123 Farm Road, City"
}
```
- Food types: `cooked`, `packaged`, `fresh_produce`, `baked`, `other`

#### Get Donation
- **GET** `/api/donations/{id}`
- Get specific donation details
- Requires: Authentication

#### Update Donation
- **PATCH** `/api/donations/{id}`
- Update donation (Owner only)
- Requires: Authentication, Owner

#### Delete Donation
- **DELETE** `/api/donations/{id}`
- Delete donation (Only if status is 'available')
- Requires: Authentication, Owner

#### Available Donations
- **GET** `/api/donations/available`
- Get all available donations
- Requires: Authentication

### Pickups

#### List Pickups
- **GET** `/api/pickups`
- List pickups based on user role
  - NGOs: Their pickups
  - Donors: Pickups of their donations
  - Admins: All pickups
- Requires: Authentication

#### Get Pickup
- **GET** `/api/pickups/{id}`
- Get detailed pickup information
- Requires: Authentication

#### Claim Donation
- **POST** `/api/pickups/claim`
- NGO claims a donation (NGO only)
- Requires: Authentication, NGO role
- Body:
```json
{
  "donation_id": 1
}
```
- Creates pickup, updates donation status, and creates tracking entry

### Tracking

#### Get Tracking Updates
- **GET** `/api/tracking/{donation_id}`
- Get all tracking updates for a donation
- Requires: Authentication
- Access: Donor (own donations), NGO (claimed pickups), Admin (all)

#### Update Status
- **POST** `/api/tracking/update`
- Update pickup status (NGO only)
- Requires: Authentication, NGO role
- Body:
```json
{
  "pickup_id": 1,
  "status": "picked_up",
  "message": "Food collected from donor"
}
```
- Valid statuses: `picked_up`, `delivered`
- Status progression: available → claimed → picked_up → delivered

### Admin

#### Dashboard Statistics
- **GET** `/api/admin/stats`
- Get dashboard statistics
- Requires: Admin role
- Returns:
```json
{
  "total_donations": 128,
  "active_ngos": 14,
  "pending_pickups": 9,
  "available_donations": 23,
  "delivered_donations": 87,
  "total_donors": 56
}
```

#### List Users
- **GET** `/api/admin/users`
- List all users with optional role filter
- Requires: Admin role
- Query params: `?role=donor|ngo|admin`

#### List All Donations
- **GET** `/api/admin/donations`
- List all donations with filters
- Requires: Admin role
- Query params: `?status=available&donor_id=1`

## Authentication

All authenticated endpoints require a JWT access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## User Roles

### Donor
- Create food donations
- View own donations
- Track pickup status
- Delete available donations

### NGO
- View available donations
- Claim donations
- Update pickup status
- Track deliveries

### Admin
- View all data
- Access dashboard statistics
- Manage users and donations

## Validation Rules

### Registration
- Email must be unique and valid
- Password minimum 8 characters
- Full name required for all users
- Organization name required for NGO role

### Food Donations
- Expiry time must be in the future
- All required fields: title, description, quantity, food_type, pickup_address
- Only donors can create donations
- Only owners can delete (and only if status is 'available')

### Pickups
- Only NGOs can claim donations
- Donation must be 'available' to claim
- One NGO per donation
- Only claiming NGO can update status

### Status Updates
- Cannot update delivered pickups
- Must follow progression: claimed → picked_up → delivered

## Development

### Run Tests
```bash
python manage.py test
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Access Admin Panel
Visit `http://localhost:8000/admin/` and login with superuser credentials

### Database
Development uses SQLite (`db.sqlite3`)
For production, update `DATABASES` in `settings.py` to use PostgreSQL

## Environment Variables

For production, set these environment variables:
- `SECRET_KEY`: Django secret key
- `DEBUG`: Set to False
- `ALLOWED_HOSTS`: Your domain names
- `DATABASE_URL`: PostgreSQL connection string

## CORS Configuration

Frontend URLs are configured in `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]
```

Add your production frontend URL when deploying.

## License

MIT License
