const nodemailer = require("nodemailer");
const logger = require("../lib/winston");
const { EmailTypes, createEmail } = require("./templateService");

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const EMAIL_SUBJECTS = {
  [EmailTypes.CONFIRMATION_EMAIL]: "Confirm your email",
};

/**
 * Send email to anyone
 * @param {EmailTypes} type
 * @param {Object} params
 */
async function sendEmail(type, params) {
  const { email, ...rest } = params;

  if (!email) {
    throw new Error('"email" inside "params" is not provided.');
  }

  const contents = await createEmail(type, rest);

  await transport.sendMail({
    from: "E-Commerce IATC <info@e-commerce-iatc>",
    to: email,
    subject: EMAIL_SUBJECTS[type],
    html: contents,
  });

  logger.info("Sent " + type + " to " + email);
}

module.exports = {
  sendEmail,
};
