const express = require("express");
const { connectToQueue } = require("../lib/rabbitmq");

const app = express();

app.get("/orders", function (req, res) {
  console.log(req.headers["x-user-id"]);
  console.log(req.headers["x-user-email"]);
  res.send([1, 2, 3]);
});

app.post("/orders", async function (_, res) {
  res.status(201).send();
  const channel = await connectToQueue();
  await channel.assertQueue("EMAILS");
  const emailJob = JSON.stringify({
    params: {
      email: "orkhan.huseyn@outlook.com",
      fullName: "Orkhan Huseynli",
      confirmationLink: "https://google.com",
    },
    type: "CONFIRMATION_EMAIL",
  });
  channel.sendToQueue("EMAILS", Buffer.from(emailJob));
});

module.exports = app;
