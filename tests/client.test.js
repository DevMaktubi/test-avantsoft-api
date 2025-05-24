const request = require('supertest');
const app = require('../src/app');
const { db } = require('../src/models');
let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/login')
    .send({ username: 'admin', password: 'admin123' });
  token = res.body.token;
});

afterAll(async () => {
  await db.close();
});

describe('Client CRUD', () => {
  let clientId;

  it('should create a client', async () => {
    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Doe', email: 'john@example.com', phone: '1234567890' });

    expect(res.statusCode).toEqual(201);
    clientId = res.body.id;
  });

  it('should list clients', async () => {
    const res = await request(app)
      .get('/api/clients')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a client', async () => {
    const res = await request(app)
      .put(`/api/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '0987654321' });

    expect(res.statusCode).toEqual(200);
  });

  it('should delete a client', async () => {
    const res = await request(app)
      .delete(`/api/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(204);
  });
});
