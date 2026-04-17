# Frontend-Backend Integration Guide

## ✅ Integration Complete!

Your React frontend is now fully connected to the Django backend. All Supabase dependencies have been replaced with Django REST API calls.

## Changes Made

### 1. **API Client** (`src/lib/api.ts`)
- Created axios instance with base URL: `http://localhost:8000/api`
- Added request interceptor to attach JWT tokens
- Added response interceptor for automatic token refresh
- Handles 401 errors and redirects to login when needed

### 2. **Authentication Context** (`src/contexts/AuthContext.tsx`)
- Replaced Supabase auth with Django JWT authentication
- Updated `signUp()` to call `/api/auth/register`
- Updated `signIn()` to call `/api/auth/login`
- Updated `signOut()` to call `/api/auth/logout` and clear tokens
- Tokens stored in localStorage: `access_token` and `refresh_token`
- Auto-loads current user on app start

### 3. **Auth Component** (`src/components/Auth.tsx`)
- Removed Supabase imports
- Fixed syntax error in handleSubmit
- Better error handling with API error messages

### 4. **Donor Dashboard** (`src/components/DonorDashboard.tsx`)
- `loadDonations()` now calls `GET /api/donations`
- `handleSubmit()` now calls `POST /api/donations`
- `handleDelete()` now calls `DELETE /api/donations/:id`
- Updated to use `user.profile` instead of separate `profile` object

### 5. **NGO Dashboard** (`src/components/NGODashboard.tsx`)
- `loadAvailableDonations()` now calls `GET /api/donations/available`
- `loadMyPickups()` now calls `GET /api/pickups`
- `handleClaimDonation()` now calls `POST /api/pickups/claim`
- Updated to use `user.profile` for user data

### 6. **Tracking Modal** (`src/components/TrackingModal.tsx`)
- `loadTracking()` now calls `GET /api/tracking/:donation_id`
- Simplified to use Django's tracking endpoint
- Shows tracking updates with creator names

### 7. **Update Status Modal** (`src/components/UpdateStatusModal.tsx`)
- `handleSubmit()` now calls `POST /api/tracking/update`
- Simplified form (removed unnecessary fields)
- Only two statuses: `picked_up` and `delivered`

## How to Run

### 1. Start Backend
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```
Backend runs at: `http://localhost:8000`

### 2. Start Frontend
```bash
npm run dev
# or
yarn dev
```
Frontend runs at: `http://localhost:5173` (or 3000)

## Testing the Integration

### 1. Register a Donor
1. Open `http://localhost:5173/auth`
2. Click "Sign up"
3. Fill in:
   - Email: `donor@test.com`
   - Password: `testpass123`
   - Full Name: `John Donor`
   - Role: Select "Donor"
   - Phone & Address (optional)
4. Click "Sign Up"
5. You should be redirected to donor dashboard

### 2. Create a Donation
1. Click "New Donation"
2. Fill in the form:
   - Title: `Fresh Vegetables`
   - Food Type: `Fresh Produce`
   - Quantity: `Serves 20 people`
   - Best Before: Select future date/time
   - Description: `10kg of fresh organic vegetables`
   - Pickup Address: `123 Main Street`
3. Click "Post Donation"
4. Donation appears in your list

### 3. Register an NGO
1. Open new incognito window or sign out
2. Go to `/auth`
3. Click "Sign up"
4. Fill in:
   - Email: `ngo@test.com`
   - Password: `testpass123`
   - Full Name: `Jane Worker`
   - Role: Select "NGO"
   - Organization Name: `Food Helpers NGO`
   - Phone & Address
5. Click "Sign Up"
6. You should be redirected to NGO dashboard

### 4. Claim a Donation (as NGO)
1. On NGO dashboard, click "Available Donations" tab
2. You should see the donation created by donor
3. Click "Claim Donation"
4. It moves to "My Pickups" tab
5. Status changes to "claimed"

### 5. Update Status (as NGO)
1. In "My Pickups" tab, click "Update" on a pickup
2. Select status: "Picked Up"
3. Add message: `Food collected from donor`
4. Click "Update Status"
5. Success!

### 6. Track Donation (as Donor or NGO)
1. Click "Track" button on any claimed donation
2. See all tracking updates with timestamps
3. Status progression: claimed → picked_up → delivered

## API Endpoints Used

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout (blacklist token)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Donations
- `GET /api/donations` - List user's donations (role-filtered)
- `POST /api/donations` - Create donation (donor only)
- `DELETE /api/donations/:id` - Delete donation (owner only)
- `GET /api/donations/available` - List available donations

### Pickups
- `GET /api/pickups` - List user's pickups
- `POST /api/pickups/claim` - Claim a donation (NGO only)

### Tracking
- `GET /api/tracking/:donation_id` - Get tracking updates
- `POST /api/tracking/update` - Update pickup status (NGO only)

## Token Management

### How It Works
1. After login/register, two tokens are received:
   - `access_token`: Short-lived (1 hour), used for API requests
   - `refresh_token`: Long-lived (7 days), used to get new access tokens

2. Access token is automatically added to all requests via interceptor

3. When access token expires (401 error):
   - Interceptor catches the error
   - Uses refresh token to get new access token
   - Retries the original request
   - User stays logged in seamlessly

4. When refresh token expires:
   - User is redirected to login page
   - All tokens are cleared

### Token Storage
Tokens are stored in `localStorage`:
```javascript
localStorage.getItem('access_token')
localStorage.getItem('refresh_token')
```

## Data Structure Differences

### Supabase vs Django

**User/Profile:**
```typescript
// Supabase (old)
user.id  // UUID string
profile.full_name
profile.organization_name

// Django (new)
user.id  // Integer
user.profile.full_name
user.profile.organization_name
user.role  // 'donor' | 'ngo' | 'admin'
```

**Donations:**
```typescript
// Supabase (old)
donation.donor_id  // UUID string

// Django (new)
donation.id  // Integer
donation.donor  // Integer (user ID)
donation.donor_name  // Added by serializer
donation.donor_email  // Added by serializer
```

**Pickups:**
```typescript
// Django returns
pickup.id
pickup.donation  // Integer (donation ID)
pickup.food_donations  // Full donation object
pickup.ngo  // Integer (user ID)
pickup.ngo_name  // Added by serializer
pickup.claimed_at
```

## Troubleshooting

### CORS Errors
If you see CORS errors:
1. Make sure Django server is running
2. Check `backend/foodshare_api/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]
```
3. Restart Django server

### 401 Unauthorized
- Clear localStorage and login again
- Check that access token is being sent in headers
- Verify token hasn't expired

### Network Errors
- Ensure backend is running on port 8000
- Check API base URL in `src/lib/api.ts`
- Look at browser console for detailed errors

### Type Errors
- TypeScript interfaces have been updated
- Remove old Supabase types if you see errors
- Check that all components import from `src/lib/api`

## Next Steps

### Optional Enhancements

1. **Add Loading States**
   - Show spinners during API calls
   - Disable buttons while submitting

2. **Better Error Handling**
   - Toast notifications for errors
   - Specific error messages from backend

3. **Pagination**
   - Backend supports pagination
   - Add pagination controls to dashboards

4. **Real-time Updates**
   - Consider WebSockets for live tracking
   - Or polling for fresh data

5. **Profile Editing**
   - Add page to update user profile
   - Use `PATCH /api/profile`

6. **Admin Dashboard**
   - Create admin dashboard component
   - Use `/api/admin/*` endpoints

## Security Notes

- ✅ JWT tokens used for authentication
- ✅ Role-based permissions enforced by backend
- ✅ CSRF protection handled by Django
- ✅ Tokens automatically refreshed
- ✅ Expired tokens handled gracefully
- ⚠️ For production: Use HTTPS
- ⚠️ For production: Store tokens in httpOnly cookies

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Django server logs
3. Verify API endpoints in Django admin
4. Test endpoints directly with Postman/Thunder Client

Backend documentation: `backend/README.md`
Quick start guide: `backend/QUICKSTART.md`
