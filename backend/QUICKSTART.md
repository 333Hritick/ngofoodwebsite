# Quick Start Guide

## Running the Backend

1. **Activate virtual environment**
```bash
cd backend
venv\Scripts\activate
```

2. **Start the server**
```bash
python manage.py runserver
```

Server will be running at: `http://localhost:8000/api/`

## Testing the API

### 1. Register a Donor
```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "email": "donor@example.com",
  "password": "testpass123",
  "full_name": "John Donor",
  "role": "donor",
  "phone": "+1234567890",
  "address": "123 Main Street"
}
```

### 2. Register an NGO
```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "email": "ngo@example.com",
  "password": "testpass123",
  "full_name": "Jane NGO Worker",
  "role": "ngo",
  "phone": "+0987654321",
  "address": "456 NGO Street",
  "organization_name": "Food Helpers NGO"
}
```

### 3. Login
```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "donor@example.com",
  "password": "testpass123"
}
```

Save the `access` token from the response!

### 4. Create a Donation (as Donor)
```bash
POST http://localhost:8000/api/donations
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Fresh Vegetables",
  "description": "10kg of fresh organic vegetables",
  "quantity": "Serves 20 people",
  "food_type": "fresh_produce",
  "expiry_time": "2026-01-30T18:00:00Z",
  "pickup_address": "123 Main Street"
}
```

### 5. View Available Donations (as NGO)
```bash
GET http://localhost:8000/api/donations/available
Authorization: Bearer YOUR_NGO_ACCESS_TOKEN
```

### 6. Claim Donation (as NGO)
```bash
POST http://localhost:8000/api/pickups/claim
Authorization: Bearer YOUR_NGO_ACCESS_TOKEN
Content-Type: application/json

{
  "donation_id": 1
}
```

### 7. Update Status (as NGO)
```bash
POST http://localhost:8000/api/tracking/update
Authorization: Bearer YOUR_NGO_ACCESS_TOKEN
Content-Type: application/json

{
  "pickup_id": 1,
  "status": "picked_up",
  "message": "Food collected from donor"
}
```

### 8. Track Donation
```bash
GET http://localhost:8000/api/tracking/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Using Postman or Thunder Client

1. Import the API endpoints above
2. Set `Authorization` header with Bearer token
3. Set `Content-Type: application/json` for POST/PATCH requests

## Admin Panel

1. Create superuser:
```bash
python manage.py createsuperuser
```

2. Access at: `http://localhost:8000/admin/`

## Troubleshooting

### Port Already in Use
```bash
python manage.py runserver 8001
```

### Database Issues
```bash
python manage.py migrate
```

### Reset Database
```bash
# Delete db.sqlite3 file
python manage.py migrate
python manage.py createsuperuser
```

## Next Steps

1. Connect your React frontend to these endpoints
2. Update axios base URL to `http://localhost:8000/api/`
3. Store JWT tokens in localStorage or cookies
4. Add token to all API requests in Authorization header
