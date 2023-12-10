// Importa as classes necessárias do DiscordJS
const {
	Client,
	Events,
	GatewayIntentBits,
	Collection,
	Itentents,
} = require("discord.js");
//Importa configurações
const { discordToken } = require("./libs/config");
//Logger
const logger = require("./libs/logger");
// Inicianliza os comandos
const { initializeCommands } = require("./libs/commands/init/deployCommands");
//Importa eventos
const {
	ready,
	interactionCreate,
	messageCreate,
	deleteChannels,
	createChannels,
	addUserById,
} = require("./libs/events");

// Db UserModel
const { createUserTable } = require("./libs/database/userModel");

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new Collection();

// Login do Bot
(async () => {
	logger.info(`Bot engraxando as engrenagens`);

	const commands = await initializeCommands();
	commands.forEach((command) => {
		client.commands.set(command.data.name, command);
	});

	// Cria tabela do usuario
	createUserTable()
		.then(() => {
			logger.info('Tabela "usuario" criada com sucesso.');
		})
		.catch((error) => {
			console.error('Erro ao criar tabela "usuario":', error);
		});

	// Pronto
	client.on("ready", ready);

	// Interação
	client.on("interactionCreate", interactionCreate);

	//Mensagem
	client.on("messageCreate", messageCreate);

	// Criar sala
	client.on("voiceStateUpdate", createChannels);

	// Apagar sala privativa
	client.on("voiceStateUpdate", deleteChannels);

	// Adiciona novo membro à DB
	client.on("guildMemberAdd", addUserById);

	logger.info("Autenticando....");
	await client.login(discordToken);
	logger.info("Autenticado com sucesso!");
})();
