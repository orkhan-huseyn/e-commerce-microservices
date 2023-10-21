const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/orders");

const Order = require("./models/order");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/orders", function (req, res) {
  res.send();
});

app.post("/orders", async function (req, res) {
  const userId = req.headers["x-user-id"];
  const userFullName = req.headers["x-user-fullname"];
  const userEmail = req.headers["x-user-email"];

  const orderItems = req.body.orderItems;

  const order = await Order.create({
    user: {
      id: userId,
      fullName: userFullName,
      email: userEmail,
    },
    items: orderItems,
  });

  res.status(201).send(order);
});

module.exports = app;
