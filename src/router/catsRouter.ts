import { Router } from "express";
import { getAllCats, addCat } from "../controller/catController";

const router = Router();

router.get("/", getAllCats);
router.post("/add-cat", addCat);

export default router;
