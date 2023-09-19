const { REST, Routes } = require("discord.js");

const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const fs = require("fs"); // Importe o módulo 'fs'
const path = require("path"); // Importe o módulo 'path'

const commandsPath = path.join(__dirname, "comandos");
const commandsFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

const commands = [];
for (const file of commandsFiles) {
	const command = require(`./comandos/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

// Deploy (Exclui o comando existente e depois recarrega os comandos)
(async () => {
	try {
		// Exclui o comando existente (substitua "ID_DO_COMANDO" pelo ID do comando a ser excluído)
		// console.log("Excluindo comando existente...");
		// await rest
		// 	.delete(
		// 		Routes.applicationGuildCommand(
		// 			CLIENT_ID,
		// 			GUILD_ID,
		// 			"1098278484897439834"
		// 		)
		// 	)
		// 	.then(() => console.log("Successfully deleted application command"))
		// 	.catch(console.error);

		// Recarrega os comandos
		console.log("Resetando comandos");
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands }
		);
		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (err) {
		console.error(err);
	}
})();
