const express = require("express");
const { proxyRequest } = require("../controllers/proxy");
const { reigsterService } = require("../controllers/registration");

const V1_ROUTER = express.Router();

V1_ROUTER.post("/registration", reigsterService);
V1_ROUTER.all("/:serviceName/:requestUrl?", proxyRequest);

module.exports = {
  V1_ROUTER,
};
