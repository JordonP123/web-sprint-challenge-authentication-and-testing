// Write your tests here
const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

describe("[POST] /api/auth/login", () => {
  it("[1] responds with a status 200 on valid credentials", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "jordon", password: "1234" });
    expect(res.status).toBe(200);
  });
  it("[2] responds with correct message on login", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "jordon", password: "1234" });
    expect(res.body.message).toBe("welcome, jordon");
  });
  it("[3] responds with status 401 on invalid credentials", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "jordon", password: "12346" });
    expect(res.status).toBe(401);
  });

  describe("[POST] /api/auth/register", () => {
    it("[4] responds with a status 200 on registration", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "jordonp", password: "12345" });
      expect(res.status).toBe(201);
    });
    it("[5] responds with correct username on successful registration", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "jordonp", password: "12345" });
      const username = await db("users").where("username", "jordonp").first();
      expect(username).toMatchObject({ username: "jordonp" });
    });
  });

  describe('[GET] /api/jokes', () => {
    it('[6] responds with status 401 when not logged in', async() => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
    })
  })
});
