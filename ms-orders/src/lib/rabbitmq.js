const amqp = require("amqplib");

async function connectToQueue() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  return channel;
}

module.exports = {
  connectToQueue,
};
