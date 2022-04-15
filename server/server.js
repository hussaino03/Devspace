const { join } = require("path");
const express = require("express");
const logger = require("pino")();
const expressLogger = require("express-pino-logger")({
  logger,
});
const tokensController = require("./controllers/tokensController");
const app = express();

app.use(expressLogger);
app.use(express.static(join(__dirname, "..", "client", "dist")));

app.use("/tokens", tokensController);

module.exports = { app, logger };
