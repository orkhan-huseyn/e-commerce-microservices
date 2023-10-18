const path = require("path");
const fs = require("fs/promises");

const registryFilePath = path.resolve("./service-registry.json");

/**
 * Returns service details from service registry
 * @param {string} serviceName
 * @returns {Object}
 */
async function getServiceFromRegistry(serviceName) {
  const serviceRegistryFileContents = await fs.readFile(registryFilePath);
  const registry = JSON.parse(serviceRegistryFileContents.toString());
  if (!registry[serviceName]) {
    throw new Error("Service does not exist in registry.");
  }
  return registry[serviceName];
}

/**
 * Update service details inside registry or register new service
 * @param {string} serviceName
 * @param {Object} serviceDetails
 */
async function updateServiceRegistry(serviceName, serviceDetails) {
  const serviceRegistryFileContents = await fs.readFile(registryFilePath);
  const registry = JSON.parse(serviceRegistryFileContents.toString());
  registry[serviceName] = serviceDetails;
  const registryFileContents = JSON.stringify(registry);
  await fs.writeFile(registryFilePath, registryFileContents);
}

module.exports = {
  getServiceFromRegistry,
  updateServiceRegistry,
};
