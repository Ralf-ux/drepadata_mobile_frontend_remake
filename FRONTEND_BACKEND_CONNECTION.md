# Frontend-Backend Connection Guide

## ✅ Security Fixes Applied

### 1. **Input Validation for Consultations & Follow-ups**
- ✅ Added validation middleware for consultation data
- ✅ Added validation middleware for follow-up data
- ✅ Validates MongoDB ObjectId formats
- ✅ Validates required fields and data types

### 2. **Mass Assignment Protection**
- ✅ Whitelist of allowed fields for consultation updates
- ✅ Whitelist of allowed fields for follow-up updates
- ✅ Filters request body to only include allowed fields

### 3. **ObjectId Validation**
- ✅ Validates patient_id and consultation_id formats
- ✅ Prevents invalid ObjectId injection
- ✅ Validates IDs in services before database operations

### 4. **Enhanced Error Handling**
- ✅ Better error messages in API service
- ✅ Handles validation errors properly
- ✅ Network error detection and user-friendly messages

### 5. **Rate Limiting**
- ✅ Applied to consultations and follow-ups endpoints
- ✅ Prevents abuse of write operations

## 🔌 Connecting Frontend to Backend

### Step 1: Configure Backend

1. **Update `.env` file in `drepadata_backend/`:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/drepadata
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,exp://localhost:8081
```

**Important for Mobile Apps:**
- Add `exp://localhost:8081` for Expo Go
- For production, add your app's URL scheme
- Mobile apps don't send an `origin` header, so they're allowed by default

### Step 2: Find Your Local IP Address

**Windows:**
```powershell
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Or
ip addr show
```

### Step 3: Configure Frontend

**Option A: Using Environment Variable (Recommended)**

1. Create `.env` file in `drepadata/` directory:
```env
EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:4000/api
```

Replace `YOUR_IP_ADDRESS` with your local IP (e.g., `192.168.1.100`)

**Option B: Using app.config.js**

The `app.config.js` file is already configured. Update it if needed:
```javascript
extra: {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://YOUR_IP:4000/api',
}
```

### Step 4: Start Backend Server

```bash
cd drepadata_backend
npm install  # If not already done
npm run dev
```

You should see:
```
🚀 Server running on port 4000
MongoDB connected
```

### Step 5: Start Frontend

```bash
cd drepadata
npm install  # If not already done
npx expo start
```

### Step 6: Test Connection

1. **Test from Expo App:**
   - Open the app on your device/emulator
   - Try creating a patient
   - Check backend console for incoming requests

2. **Test API Directly:**
   ```bash
   # Test health endpoint
   curl http://YOUR_IP:4000/api/patients
   ```

## 🔍 Troubleshooting

### Issue: "Network error: Unable to connect to server"

**Solutions:**
1. ✅ Check backend is running on port 4000
2. ✅ Verify IP address in frontend config matches your machine's IP
3. ✅ Check firewall isn't blocking port 4000
4. ✅ Ensure device/emulator is on same network
5. ✅ For Android emulator, use `10.0.2.2` instead of `localhost`
6. ✅ For iOS simulator, use `localhost` or your Mac's IP

### Issue: "CORS error"

**Solutions:**
1. ✅ Check `ALLOWED_ORIGINS` in backend `.env`
2. ✅ Add your frontend origin to the list
3. ✅ Mobile apps don't need CORS (no origin header)

### Issue: "Validation failed"

**Solutions:**
1. ✅ Check required fields are being sent
2. ✅ Verify patient_id is valid MongoDB ObjectId (24 hex characters)
3. ✅ Check field names match the API expectations
4. ✅ Review error messages in API response

### Issue: "Invalid patient ID format"

**Solutions:**
1. ✅ Ensure patient is created first and returns MongoDB `_id`
2. ✅ Use the `_id` from MongoDB response, not a generated UUID
3. ✅ Verify ObjectId is 24 hex characters

## 📱 Mobile App Specific Notes

### Expo Go
- Use your computer's IP address
- Format: `http://192.168.1.100:4000/api`
- Add `exp://localhost:8081` to `ALLOWED_ORIGINS` if needed

### Development Build
- Same as Expo Go
- Can use `localhost` on iOS simulator
- Use `10.0.2.2` on Android emulator

### Production
- Use HTTPS URL
- Update `EXPO_PUBLIC_API_URL` to production API
- Update `ALLOWED_ORIGINS` in backend

## 🔐 Security Checklist

- ✅ Input validation on all endpoints
- ✅ Mass assignment protection
- ✅ ObjectId validation
- ✅ Rate limiting
- ✅ CORS configured
- ✅ Error handling
- ✅ Request size limits
- ⚠️ **Authentication still needed** (add before production)

## 📊 API Endpoints

### Patients
- `POST /api/patients` - Create patient (validated)
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID (ObjectId validated)
- `PATCH /api/patients/:id` - Update patient (validated, filtered)
- `DELETE /api/patients/:id` - Delete patient (ObjectId validated)

### Consultations
- `POST /api/consultations` - Create consultation (validated, filtered)
- `GET /api/consultations` - Get all consultations
- `GET /api/consultations/:id` - Get consultation by ID (ObjectId validated)
- `GET /api/consultations/patient/:patientId` - Get consultations for patient (ObjectId validated)
- `PATCH /api/consultations/:id` - Update consultation (validated, filtered)
- `DELETE /api/consultations/:id` - Delete consultation (ObjectId validated)

### Follow-ups
- `POST /api/follow-ups` - Create follow-up (validated, filtered)
- `GET /api/follow-ups` - Get all follow-ups
- `GET /api/follow-ups/:id` - Get follow-up by ID (ObjectId validated)
- `GET /api/follow-ups/patient/:patientId` - Get follow-ups for patient (ObjectId validated)
- `PATCH /api/follow-ups/:id` - Update follow-up (validated, filtered)
- `DELETE /api/follow-ups/:id` - Delete follow-up (ObjectId validated)

## 🚀 Quick Start Commands

```bash
# Terminal 1 - Backend
cd drepadata_backend
npm install
npm run dev

# Terminal 2 - Frontend
cd drepadata
npm install
npx expo start
```

## 📝 Example API Call from Frontend

```typescript
import { patientAPI } from './utils/api';

// Create patient
const patient = {
  nom: "Doe",
  prenom: "John",
  sexe: "M",
  date_diagnostic: new Date(),
  age_diagnostic: 25,
  circonstances_diagnostic: "Routine checkup",
  numero_identification_unique: "PAT001"
};

try {
  const response = await patientAPI.create(patient);
  console.log('Patient created:', response.data._id);
} catch (error) {
  console.error('Error:', error.message);
}
```

## ✅ Connection Test

Run this in your frontend to test:

```typescript
import { patientAPI } from './utils/api';

// Test connection
patientAPI.getAll()
  .then(data => console.log('✅ Connected!', data))
  .catch(error => console.error('❌ Connection failed:', error.message));
```

If you see "✅ Connected!", your frontend and backend are properly connected!

