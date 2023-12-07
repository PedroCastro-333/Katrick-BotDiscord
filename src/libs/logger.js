const pino = require("pino");
const pretty = require("pino-pretty");

const logger = pino(
	{
		// Suas outras configurações, se necessário
	},
	pretty()
);

module.exports = logger;
