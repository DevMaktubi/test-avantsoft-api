const request = require("supertest");
const app = require("../src/app");
const { Client, Sale, db } = require("../src/models");

let token;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/login")
    .send({ username: "admin", password: "admin123" });
  token = res.body.token;
});

// Clear test data between tests
afterEach(async () => {
  await Sale.destroy({ where: {} });
  await Client.destroy({ where: {} });
});

afterAll(async () => {
  await db.close();
});

describe("Statistics", () => {
  it("should return the client with the most sales volume", async () => {
    // Create test client
    const resClientVolume = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        email: "johnDoe@gmail.com",
        phone: "1234567890",
      });
    const volumeClientId = resClientVolume.body.id;

    // Create test sale
    await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ clientId: volumeClientId, amount: 100, date: "2023-10-01" });

    // Test the endpoint
    const res = await request(app)
      .get("/api/statistics/most-volume")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", volumeClientId);
    expect(res.body).toHaveProperty("salesCount", 1);
  });

  it("should return the client with the biggest sale value mean", async () => {
    // Create test client
    const resClientMean = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jane Doe",
        email: "janeDoe@gmail.com",
        phone: "0987654321",
      });
    const meanClientId = resClientMean.body.id;

    // Create test sales
    await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ clientId: meanClientId, amount: 200, date: "2023-10-01" });

    await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ clientId: meanClientId, amount: 300, date: "2023-10-02" });

    // Test the endpoint
    const res = await request(app)
      .get("/api/statistics/biggest-sale-mean")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", meanClientId);
    expect(res.body).toHaveProperty("mean", 250);
  });

  it("should return the client with the biggest sale frequency", async () => {
    // Create test client
    const resClientFrequency = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Alice Doe",
        email: "aliceDoe@gmail.com",
        phone: "1122334455",
      });
    const frequencyClientId = resClientFrequency.body.id;

    // Create test sales (using Promise.all to wait for all requests)
    const salesPromises = Array.from({ length: 10 }).map((_, index) =>
      request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          clientId: frequencyClientId,
          amount: 100,
          date: `2023-10-${index + 10}`,
        })
    );

    await Promise.all(salesPromises);

    // Test the endpoint
    const res = await request(app)
      .get("/api/statistics/biggest-sale-frequency")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", frequencyClientId);
    expect(res.body).toHaveProperty("frequency", 10);
  });
});
