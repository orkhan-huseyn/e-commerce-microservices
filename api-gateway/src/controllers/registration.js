const { updateServiceRegistry } = require("../services/registryService");

async function reigsterService(req, res) {
  try {
    const { host, port, serviceName } = req.body;
    await updateServiceRegistry(serviceName, { host, port });
    res.send();
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
}

module.exports = {
  reigsterService,
};
