const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be a positive number"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    payMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["cash", "UPI", "Netbanking", "paypal"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Receipt", receiptSchema);
