import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  razorpayId:  { type: String },
  orderId:     { type: String },
  amount:      { type: Number, required: true },
  status:      { type: String, enum: ["created", "paid", "failed"], default: "created" }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
