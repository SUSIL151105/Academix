import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createOrder, confirmPayment } from "../controllers/PaymentController.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/confirm", protect, confirmPayment);

export default router;
