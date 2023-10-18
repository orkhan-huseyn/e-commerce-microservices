const app = require("./src/app");
const axios = require("axios").default;

const HOST = process.env.IP_V4 || "127.0.0.1";
const PORT = 0;

const server = app.listen(PORT, HOST, function () {
  console.log("Orders service is running on port " + server.address().port);

  axios
    .post("http://localhost:8080/api/v1/registration", {
      host: HOST,
      port: server.address().port,
      serviceName: "orders",
    })
    .then(function () {
      console.log("Successfully registered on API Gateway.");
    })
    .catch(function () {
      console.log("Error registering on API Gateway. " + error.message);
    });
});
