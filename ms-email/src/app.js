require("dotenv").config();

const logger = require("./lib/winston");
const { connectToQueue } = require("./lib/rabbitmq");
const { sendEmail } = require("./services/emailService");

async function main() {
  try {
    const channel = await connectToQueue();
    await channel.assertQueue("EMAILS");
    logger.info('Asserted "EMAILS" queue');

    logger.info('Starting to consume "EMAILS" queue');
    channel.consume("EMAILS", async function (message) {
      const rawMessage = message.content.toString();
      logger.info('Recevied a message from "EMAILS" queue ' + rawMessage);
      const { type, params } = JSON.parse(rawMessage);
      try {
        await sendEmail(type, params);
        channel.ack(message);
      } catch (error) {
        logger.error("Error sending email: " + error.message);
      }
    });
  } catch (error) {
    logger.error(
      "Error during connecting to AMQP server or channel creation " +
        error.message
    );
  }
}

main();
