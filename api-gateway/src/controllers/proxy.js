const axios = require("axios").default;
const express = require("express");
const { getUserFromAuthMS } = require("../services/authService");
const { getServiceFromRegistry } = require("../services/registryService");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function proxyRequest(req, res) {
  const { serviceName, requestUrl = "" } = req.params;

  const { userId, userEmail } = await getUserFromAuthMS(
    req.headers["authorization"]
  );

  const { host, port } = await getServiceFromRegistry(serviceName);
  try {
    const response = await axios({
      method: req.method,
      url: `http://${host}:${port}/${serviceName}/${requestUrl}`,
      headers: {
        "x-user-id": userId,
        "x-user-email": userEmail,
        ...req.headers,
      },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
}

module.exports = {
  proxyRequest,
};
