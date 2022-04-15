const config = require("./config");
const { app, logger } = require("./server");

app.listen(config.port, () => {
  logger.info(`Listening on http://localhost:${config.port}`);
});
