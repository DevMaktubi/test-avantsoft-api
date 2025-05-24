const request = require("supertest");
const app = require("../src/app");
const { db } = require("../src/models");

afterAll(async () => {
  await db.close();
});

describe("Auth Tests", () => {
  it("should return token on valid login", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "admin", password: "admin123" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject invalid login", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "admin", password: "wrong" });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Credenciais inválidas.");
  });

  it("should return 401 for protected route without token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", "");
    expect(res.statusCode).toEqual(401);
  });
  it("should return 401 for protected route with invalid token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer invalid_token`);
    expect(res.statusCode).toEqual(401);
  });
  it("should return 200 for protected route with valid token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer valid_token`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Autorizado");
  });
});
