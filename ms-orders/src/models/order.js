const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      id: String,
      fullName: String,
      email: String,
    },
    status: {
      type: String,
      enum: ["PLACED", "PAID", "REJECTED"],
    },
    items: [
      {
        product: {
          id: String,
          title: String,
          price: Number,
        },
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
