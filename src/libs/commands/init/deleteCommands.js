const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CLIENT_ID } = process.env;

const rest = new REST({ version: "10" }).setToken(TOKEN);

// Command IDs to be deleted
const commandIdsToDelete = ["1182054842508783648", "1182054842508783647"];

(async () => {
	try {
		console.log("Deleting existing commands...");

		for (const commandId of commandIdsToDelete) {
			await rest
				.delete(Routes.applicationCommands(CLIENT_ID, commandId))
				.then(() =>
					console.log(`Successfully deleted command with ID ${commandId}`)
				)
				.catch(console.error);
		}

		console.log("Commands deleted successfully.");
	} catch (error) {
		console.error(error);
	}
})();
