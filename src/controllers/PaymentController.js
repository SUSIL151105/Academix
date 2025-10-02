import Razorpay from "razorpay";
import Payment from "../models/payment.js";
import User from "../models/user.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order (frontend sends amount in rupees)
export const createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body; // e.g., 199 for ₹199
    if (!amount) return res.status(400).json({ message: "Amount required" });

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    // Save order metadata
    const payment = await Payment.create({
      user: req.user._id,
      orderId: order.id,
      amount: options.amount,
      status: "created"
    });

    res.json({ order, paymentId: payment._id });
  } catch (err) {
    next(err);
  }
};

// Confirm payment (frontend should verify signature and send paymentId, razorpay_payment_id, status)
export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentId, razorpay_payment_id, status } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.razorpayId = razorpay_payment_id;
    payment.status = status;
    await payment.save();

    if (status === "paid") {
      // upgrade user to premium
      await User.findByIdAndUpdate(payment.user, { isPremium: true });
    }

    res.json({ message: "Payment updated", payment });
  } catch (err) {
    next(err);
  }
};
