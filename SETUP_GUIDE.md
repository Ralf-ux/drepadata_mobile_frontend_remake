# Quick Setup Guide

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd drepadata_backend
```

### 2. Create Environment File
Create a `.env` file in the `drepadata_backend` directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
PORT=4000
NODE_ENV=development
```

**Important:** Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string.

Example MongoDB Atlas connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/drepadata?retryWrites=true&w=majority
```

### 3. Install Dependencies (if not already installed)
```bash
npm install
```

### 4. Start the Backend Server
```bash
npm run dev
```

You should see:
```
✅ Environment variables validated
✅ MongoDB connected successfully
🚀 Server running on http://0.0.0.0:4000
```

## Frontend Setup

### 1. Configure API URL

The frontend is already configured to use `http://localhost:4000/api` by default.

If you need to change the API URL (for example, if running on a different machine or port), you can:

1. Set environment variable in your frontend:
   - Create or update `.env` in the `drepadata` directory:
   ```
   EXPO_PUBLIC_API_URL=http://your-backend-ip:4000/api
   ```

2. Or update `drepadata/utils/api.ts` directly:
   ```typescript
   const API_BASE_URL = 'http://your-backend-ip:4000/api';
   ```

### 2. For Mobile Development (Expo)

If you're testing on a physical device or emulator:

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Update the API URL to use your IP:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.XXX:4000/api
   ```

3. Make sure your mobile device/emulator is on the same network

## Testing the Connection

### 1. Test Backend Health
```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Test Creating a Patient

From your frontend app:
1. Navigate to "Create Patient"
2. Fill in the required fields
3. Submit the form
4. Check MongoDB Atlas to verify the patient was saved

### 3. Verify Data in MongoDB Atlas

1. Log into MongoDB Atlas
2. Navigate to your cluster
3. Click "Browse Collections"
4. You should see:
   - `patients` collection
   - `consultations` collection
   - `followups` collection
   - `vaccinations` collection

## Troubleshooting

### Backend won't start
- **Error: "MONGODB_URI is not defined"**
  - Make sure you created a `.env` file in `drepadata_backend/`
  - Check that `MONGODB_URI` is set correctly

- **Error: "MongoDB connection error"**
  - Verify your MongoDB Atlas connection string is correct
  - Check that your IP is whitelisted in MongoDB Atlas (Network Access)
  - Verify your database user credentials

### Data not saving to database
- Check backend console for error messages
- Verify MongoDB connection is successful (should see "✅ MongoDB connected")
- Check that the request is reaching the backend (check network tab in browser/dev tools)
- Verify the response from backend includes `success: true`

### Frontend can't connect to backend
- **Network error: Unable to connect to server**
  - Verify backend is running (`npm run dev` in backend directory)
  - Check the API URL in `drepadata/utils/api.ts`
  - For mobile: Make sure you're using your computer's IP address, not `localhost`
  - Check firewall settings

### CORS errors
- The backend is configured to allow all origins in development
- If you still see CORS errors, check `drepadata_backend/src/config/corsSetup.ts`

## Data Flow Verification

1. **Create Patient:**
   - Frontend → `POST /api/patients`
   - Backend saves to MongoDB `patients` collection
   - Returns patient with `_id`

2. **Create Consultation:**
   - Frontend → `POST /api/consultations` with `patient_id`
   - Backend validates `patient_id` and saves to MongoDB `consultations` collection
   - Consultation is linked to patient via `patient_id` reference

3. **Create Follow-up:**
   - Frontend → `POST /api/follow-ups` with `patient_id` and `consultation_id`
   - Backend validates IDs and saves to MongoDB `followups` collection
   - Follow-up is linked to both patient and consultation

4. **Create Vaccination:**
   - Frontend → `POST /api/vaccinations` with `patient_id`
   - Backend validates `patient_id` and saves to MongoDB `vaccinations` collection
   - Vaccination is linked to patient via `patient_id` reference

5. **Get Patient with All Data:**
   - Frontend → `GET /api/patients/{id}?include=all`
   - Backend fetches patient and all related records
   - Returns: `{ patient, consultations, followUps, vaccinations }`

## Next Steps

1. ✅ Backend is running and connected to MongoDB
2. ✅ Frontend can connect to backend
3. ✅ Create a test patient
4. ✅ Create a consultation for that patient
5. ✅ Create a follow-up for that patient
6. ✅ Create a vaccination record for that patient
7. ✅ Retrieve patient with all related data
8. ✅ Verify all data appears in MongoDB Atlas

## Support

If you encounter any issues:
1. Check the backend console for error messages
2. Check the frontend console (React Native debugger or browser console)
3. Verify MongoDB Atlas connection
4. Review the `BACKEND_FIXES_SUMMARY.md` for detailed information about the fixes

