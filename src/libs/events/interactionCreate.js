const logger = require("../logger");

module.exports = async (interaction) => {
	try {
		const userId = interaction.user.id;
		const command = interaction.client.commands.get(interaction.commandName);

		await command.execute(interaction, userId);
	} catch (err) {
		console.error(err, "An error occurred executing a command");
	}
};
