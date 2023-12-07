const { RESTJSONErrorCodes } = require("discord.js");
const { REST, Routes } = require("discord.js");
const { discordToken, clientID } = require("../../config");
const fs = require("fs");
const path = require("path");
const logger = require("../../logger");

exports.initializeCommands = async () => {
	const commands = [];
	const commandsFile = fs
		.readdirSync(path.resolve(__dirname, "../"))
		.filter((x) => x.endsWith(".js"));

	for (const file of commandsFile) {
		const command = require(`../${file}`);
		commands.push(command);
	}

	logger.info(`Comandos carregados!`);

	const rest = new REST({ version: 10 }).setToken(discordToken);
	logger.info(`Registrando comandos do bot!`);
	await rest
		.put(Routes.applicationCommands(clientID), {
			body: commands.map((x) => x.data),
		})
		.then(() => logger.info(`Comandos registrados com sucesso!!`))
		.catch(console.error);

	return commands;
};
