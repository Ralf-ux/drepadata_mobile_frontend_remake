# MongoDB Atlas Integration - Implementation Guide

## Overview

The application has been updated to save all data (patients, consultations, follow-ups) to MongoDB Atlas. The data flow is:

1. **Patient Creation** → Saved to MongoDB Atlas → Can create consultation
2. **Consultation** → Saved to MongoDB Atlas → Can create follow-up
3. **Follow-up** → Saved to MongoDB Atlas

## Backend Implementation

### New Models Created

1. **Consultation Model** (`drepadata_backend/src/models/consultation.model.ts`)
   - Complete consultation data structure
   - Linked to Patient via `patient_id`
   - All 9 steps of consultation data

2. **FollowUp Model** (`drepadata_backend/src/models/followup.model.ts`)
   - Follow-up data structure
   - Linked to Patient and Consultation
   - Auto-increments follow_up_number

### New Routes & Controllers

- **Consultations**: `/api/consultations`
  - POST `/api/consultations` - Create consultation
  - GET `/api/consultations` - Get all consultations
  - GET `/api/consultations/:id` - Get consultation by ID
  - GET `/api/consultations/patient/:patientId` - Get consultations for a patient
  - PATCH `/api/consultations/:id` - Update consultation
  - DELETE `/api/consultations/:id` - Delete consultation

- **Follow-ups**: `/api/follow-ups`
  - POST `/api/follow-ups` - Create follow-up
  - GET `/api/follow-ups` - Get all follow-ups
  - GET `/api/follow-ups/:id` - Get follow-up by ID
  - GET `/api/follow-ups/patient/:patientId` - Get follow-ups for a patient
  - PATCH `/api/follow-ups/:id` - Update follow-up
  - DELETE `/api/follow-ups/:id` - Delete follow-up

## Frontend Implementation

### API Service (`drepadata/utils/api.ts`)

Created a centralized API service that:
- Handles all API calls to the backend
- Manages authentication headers (ready for future JWT)
- Provides helper functions for patient identities

### Updated Storage Functions

All storage functions now:
1. **Save to MongoDB Atlas first** via API
2. **Then save locally** to AsyncStorage for offline access
3. **Handle both create and update** operations

### Consultation Form

The consultation form component has been created at:
- `drepadata/components/ConsultationForm.tsx`

**Note**: You need to copy the complete render methods (renderStep1-9) from your provided code into this file. The structure is set up, but the full rendering logic needs to be added.

## Data Flow

### Creating a Patient

```typescript
// In create-patient.tsx or similar
const patient = {
  nom: "Doe",
  prenom: "John",
  // ... other fields
};

await savePatient(patient);
// → Saves to MongoDB Atlas
// → Also saves to AsyncStorage
// → Returns MongoDB _id
```

### Creating a Consultation

```typescript
// In ConsultationForm.tsx
const consultation = {
  patient_id: patientId, // MongoDB ObjectId
  consultation_type: 'initial',
  // ... all consultation fields
};

await saveConsultation(consultation);
// → Saves to MongoDB Atlas
// → Links to patient via patient_id
// → Also saves to AsyncStorage
```

### Creating a Follow-up

```typescript
// In follow-up screen
const followUp = {
  patient_id: patientId,
  consultation_id: consultationId,
  follow_up_number: 1,
  // ... follow-up fields
};

await saveFollowUp(followUp);
// → Saves to MongoDB Atlas
// → Links to patient and consultation
// → Auto-increments follow_up_number
```

## Configuration

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/drepadata?retryWrites=true&w=majority
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

### Frontend (app.config.js or .env)

```javascript
// app.config.js
export default {
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://YOUR_IP:4000/api'
  }
}
```

Or in `.env`:
```
EXPO_PUBLIC_API_URL=http://YOUR_IP:4000/api
```

## Testing the Integration

### 1. Test Patient Creation

```bash
# Create a patient via the app
# Check MongoDB Atlas to verify the patient was saved
```

### 2. Test Consultation Creation

```bash
# After creating a patient:
# 1. Select the patient
# 2. Fill out the consultation form (all 9 steps)
# 3. Submit
# 4. Check MongoDB Atlas - consultation should be linked to patient
```

### 3. Test Follow-up Creation

```bash
# After creating a consultation:
# 1. Select the patient
# 2. Create a follow-up
# 3. Check MongoDB Atlas - follow-up should be linked to patient and consultation
```

## MongoDB Atlas Setup

1. **Create a MongoDB Atlas account** at https://www.mongodb.com/cloud/atlas
2. **Create a cluster** (free tier available)
3. **Get connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
4. **Update .env** with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/drepadata
   ```
5. **Add your IP to whitelist** in MongoDB Atlas Network Access
6. **Create database user** if needed

## Next Steps

1. **Complete ConsultationForm.tsx**:
   - Copy all renderStep methods (1-9) from your provided code
   - Ensure all form fields are included
   - Test the form submission

2. **Test the complete flow**:
   - Create patient → Create consultation → Create follow-up
   - Verify all data appears in MongoDB Atlas

3. **Handle offline scenarios**:
   - The app saves locally first, then syncs
   - Consider adding a sync queue for offline operations

4. **Add error handling**:
   - Show user-friendly error messages
   - Handle network failures gracefully
   - Retry failed API calls

## API Endpoints Summary

### Patients
- `POST /api/patients` - Create patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `PATCH /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Consultations
- `POST /api/consultations` - Create consultation
- `GET /api/consultations` - Get all consultations
- `GET /api/consultations/:id` - Get consultation by ID
- `GET /api/consultations/patient/:patientId` - Get consultations for patient
- `PATCH /api/consultations/:id` - Update consultation
- `DELETE /api/consultations/:id` - Delete consultation

### Follow-ups
- `POST /api/follow-ups` - Create follow-up
- `GET /api/follow-ups` - Get all follow-ups
- `GET /api/follow-ups/:id` - Get follow-up by ID
- `GET /api/follow-ups/patient/:patientId` - Get follow-ups for patient
- `PATCH /api/follow-ups/:id` - Update follow-up
- `DELETE /api/follow-ups/:id` - Delete follow-up

## Troubleshooting

### Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Verify network connectivity

### Data Not Saving
- Check backend logs for errors
- Verify API endpoint URLs
- Check CORS configuration
- Verify patient_id is valid MongoDB ObjectId

### Frontend Errors
- Check API base URL configuration
- Verify network requests in React Native debugger
- Check AsyncStorage permissions

## Security Notes

All security fixes from the previous implementation are still in place:
- Input validation
- NoSQL injection protection
- Rate limiting
- CORS restrictions
- Error handling

**Remember**: Authentication is still not implemented. Add it before production!

