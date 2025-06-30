import express from "express";
import { createItem, getItems } from "../controller/userController.js";
import { checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin and staff can create items
router.post("/post", checkRole, createItem);

// Anyone can view items
router.get("/", getItems);

export default router;
