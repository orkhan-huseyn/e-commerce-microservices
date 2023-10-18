const express = require("express");

const app = express();

app.get("/orders", function (req, res) {
  console.log(req.headers["x-user-id"]);
  console.log(req.headers["x-user-email"]);
  res.send([1, 2, 3]);
});

app.post("/orders", function (_, res) {
  res.status(201).send();
});

module.exports = app;
