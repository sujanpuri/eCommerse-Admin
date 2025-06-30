import express from "express";
import { createItem, getItems, uploadItemImage } from "../controller/itemController.js";
import { checkRole } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Only admin and staff can create items
router.post("/post", checkRole, createItem);

// Anyone can view items
router.get("/", getItems);


// Upload image route
router.post('/upload-image', upload.single('image'), uploadItemImage);

export default router;
