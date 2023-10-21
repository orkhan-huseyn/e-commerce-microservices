const fs = require("fs/promises");
const path = require("path");
const Handlebars = require("handlebars");

const EmailTypes = {
  CONFIRMATION_EMAIL: "CONFIRMATION_EMAIL",
  PASSWORD_RESET_EMAIL: "PASSWORD_RESET_EMAIL",
  ORDER_PLACED_EMAIL: "ORDER_PLACED_EMAIL",
};

/**
 * @param {{fullName: string, confirmationLink: string}} params
 * @returns {Promise<string>}
 */
async function createConfirmationEmail({ fullName, confirmationLink }) {
  const contents = await fs.readFile(
    path.resolve("./src/templates/confirmation.hbs")
  );
  const tempalte = Handlebars.compile(contents.toString());
  return tempalte({ fullName, confirmationLink });
}

/**
 * Create email template string
 * @param {EmailTypes} emailType
 * @param {Object} params
 * @returns {Promise<string>}
 */
async function createEmail(emailType, params) {
  switch (emailType) {
    case EmailTypes.CONFIRMATION_EMAIL:
      return await createConfirmationEmail(params);
    default:
      throw new Error("Unknown email type");
  }
}

module.exports = {
  EmailTypes,
  createEmail,
};
