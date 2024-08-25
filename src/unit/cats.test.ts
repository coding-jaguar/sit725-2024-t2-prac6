import request from "supertest";
import express, { Express } from "express";
import catsRouter from "../router/catsRouter";
import prisma from "../model/prisma";

// Mock the Prisma client
jest.mock("../model/prisma", () => ({
  cat: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Cat Router", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/v1/cats", catsRouter);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock history between tests
  });

  describe("GET /api/v1/cats", () => {
    it("should return all cats with a status code of 200", async () => {
      const mockCats = [
        {
          id: 1,
          name: "Whiskers",
          image: "image1.png",
          description: "Fluffy cat",
        },
        {
          id: 2,
          name: "Mittens",
          image: "image2.png",
          description: "Playful kitten",
        },
      ];
      (prisma.cat.findMany as jest.Mock).mockResolvedValue(mockCats);

      const response = await request(app).get("/api/v1/cats");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCats);
      expect(prisma.cat.findMany).toHaveBeenCalledTimes(1);
    });

    it("should handle errors and return a status code of 500", async () => {
      (prisma.cat.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/v1/cats");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Database error" });
      expect(prisma.cat.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/v1/cats/add-cat", () => {
    it("should add a new cat and return a status code of 201", async () => {
      const newCat = {
        name: "Mittens",
        image: "image2.png",
        description: "Cute kitten",
      };
      (prisma.cat.create as jest.Mock).mockResolvedValue(newCat);

      const response = await request(app)
        .post("/api/v1/cats/add-cat")
        .send(newCat);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newCat);
      expect(prisma.cat.create).toHaveBeenCalledTimes(1);
      expect(prisma.cat.create).toHaveBeenCalledWith({
        data: newCat,
      });
    });

    it("should return a status code of 400 if required fields are missing", async () => {
      const incompleteCat = { image: "image2.png" };
      const response = await request(app)
        .post("/api/v1/cats/add-cat")
        .send(incompleteCat);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Name, image, and description are required",
      });
    });

    it("should handle errors and return a status code of 500", async () => {
      const newCat = {
        name: "Mittens",
        image: "image2.png",
        description: "Cute kitten",
      };
      (prisma.cat.create as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/api/v1/cats/add-cat")
        .send(newCat);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Database error" });
      expect(prisma.cat.create).toHaveBeenCalledTimes(1);
    });
  });
});
