const amqp = require("amqplib");
const logger = require("../lib/winston");

async function connectToQueue() {
  const connection = await amqp.connect("amqp://localhost:5672");
  logger.info("Connected to AMQP server");
  const channel = await connection.createChannel();
  logger.info("Created a channel");
  return channel;
}

module.exports = {
  connectToQueue,
};
