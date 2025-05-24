const request = require('supertest');
const app = require('../src/app');
const { db } = require('../src/models');

let token, clientId;

beforeAll(async () => {
  const auth = await request(app).post('/api/login').send({ username: 'admin', password: 'admin123' });
  token = auth.body.token;

  const client = await request(app)
    .post('/api/clients')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Buyer', email: 'buyer@example.com', phone: '111111111' });

  clientId = client.body.id;
});

afterAll(async () => {
  await db.close();
});

describe('Sale Logic', () => {
  it('should register a sale', async () => {
    const res = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId, amount: 100});

    expect(res.statusCode).toEqual(201);
    expect(res.body.amount).toBe("100");
  });
  it('should register a sale with a specific date', async () => {
    const res = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId, amount: 100, date: '2023-10-01' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.date).toBe("2023-10-01");
  });
  it('should return the sale date even if its not provided', async () => {
    const res = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId, amount: 100});

    expect(res.statusCode).toEqual(201);
    expect(res.body.date).toBeDefined();
  });
});
