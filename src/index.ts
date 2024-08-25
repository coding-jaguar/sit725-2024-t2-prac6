import express from "express";
import cors from "cors";
import catsRouter from "./router/catsRouter";

const app = express();

app.use(express.json());
app.use(cors());

// Prefix the cats routes with /api/vq/cats
app.use("/api/v1/cats", catsRouter);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
