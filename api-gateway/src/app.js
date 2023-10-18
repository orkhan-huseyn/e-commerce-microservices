const express = require("express");
const { V1_ROUTER } = require("./routes/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", V1_ROUTER);

module.exports = app;
