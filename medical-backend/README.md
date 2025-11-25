# Medical Backend API

Backend API for the Medical Patient Management System built with Node.js, Express, and MongoDB Atlas.

## Features

- **Patient Management**: Complete CRUD operations for patient profiles
- **Consultation Tracking**: Record and manage patient consultations
- **Follow-up Management**: Track patient follow-ups and progress
- **Vaccination Records**: Manage vaccination schedules and records
- **Statistics**: Generate comprehensive statistics and reports
- **Search & Filter**: Advanced search and filtering capabilities
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Centralized error handling
- **Security**: Helmet, CORS, rate limiting, and input sanitization

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd medical-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=your-mongodb-atlas-connection-string
CORS_ORIGIN=http://localhost:8081
API_VERSION=v1
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Patients
- POST `/api/v1/patients` - Create a new patient
- GET `/api/v1/patients` - Get all patients (with pagination)
- GET `/api/v1/patients/:id` - Get patient by ID
- PUT `/api/v1/patients/:id` - Update patient
- DELETE `/api/v1/patients/:id` - Delete patient
- GET `/api/v1/patients/search?query=term` - Search patients
- GET `/api/v1/patients/identities` - Get patient identities for dropdowns
- GET `/api/v1/patients/stats` - Get patient statistics

### Consultations
- POST `/api/v1/consultations` - Create a new consultation
- GET `/api/v1/consultations` - Get all consultations
- GET `/api/v1/consultations/:id` - Get consultation by ID
- GET `/api/v1/consultations/patient/:patientId` - Get consultations by patient ID
- PUT `/api/v1/consultations/:id` - Update consultation
- DELETE `/api/v1/consultations/:id` - Delete consultation

### Follow-ups
- POST `/api/v1/follow-ups` - Create a new follow-up
- GET `/api/v1/follow-ups` - Get all follow-ups
- GET `/api/v1/follow-ups/:id` - Get follow-up by ID
- PUT `/api/v1/follow-ups/:id` - Update follow-up
- DELETE `/api/v1/follow-ups/:id` - Delete follow-up

### Vaccinations
- POST `/api/v1/vaccinations` - Create a new vaccination record
- GET `/api/v1/vaccinations` - Get all vaccination records
- GET `/api/v1/vaccinations/:id` - Get vaccination by ID
- PUT `/api/v1/vaccinations/:id` - Update vaccination
- DELETE `/api/v1/vaccinations/:id` - Delete vaccination

## Testing

Run tests with:
```bash
npm test
```

## Security Features

- Helmet: Security headers
- CORS: Cross-Origin Resource Sharing configuration
- Rate Limiting: API request rate limiting
- Input Validation: Using express-validator
- Error Handling: Centralized and comprehensive response management

## Performance Features

- Database Indexing: Optimized MongoDB indexes
- Compression: Response compression
- Pagination: Efficient data pagination
- Lean Queries: Using lean() for read-only operations
- Population Control: Selective field population

## Notes

- Replace `<your-repo-url>` with actual repo URL if applicable.
- Ensure your MongoDB Atlas URI is accurate and secure.
- Modify CORS origins as per frontend hosting.
