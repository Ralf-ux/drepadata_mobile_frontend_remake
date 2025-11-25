const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Medical Backend API', () => {
  beforeAll(async () => {
    // Connect to test database (use a test URI or mocks)
    const uri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/medical-backend-test';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Health check endpoint
  it('GET /health - should return server status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });

  // Patient CRUD test example
  let createdPatientId;

  it('POST /api/v1/patients - create patient', async () => {
    const newPatient = {
      numero_identification_unique: 'ID001',
      nom: 'Test',
      prenom: 'User',
      sexe: 'Masculin',
      date_naissance: '1990-01-01',
      age: 33,
      type_drepanocytose: 'SS',
      date_diagnostic: '2020-01-01',
      age_diagnostic: 30,
      circonstances_diagnostic: 'Test',
      groupe_sanguin_rhesus: 'O+',
      region: 'Centre'
    };

    const res = await request(app)
      .post('/api/v1/patients')
      .send(newPatient);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('_id');
    createdPatientId = res.body.data._id;
  });

  it('GET /api/v1/patients/:id - get patient by ID', async () => {
    const res = await request(app).get(`/api/v1/patients/${createdPatientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('numero_identification_unique', 'ID001');
  });

  it('PUT /api/v1/patients/:id - update patient', async () => {
    const res = await request(app)
      .put(`/api/v1/patients/${createdPatientId}`)
      .send({ prenom: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('prenom', 'Updated');
  });

  it('DELETE /api/v1/patients/:id - delete patient', async () => {
    const res = await request(app).delete(`/api/v1/patients/${createdPatientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  // Additional tests for consultations, follow-ups, vaccinations endpoints can be written similarly
});
