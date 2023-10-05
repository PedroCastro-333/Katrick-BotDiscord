// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

// Require the necessary openai classes
const { OpenAI } = require("openai");

//guildConfig
const guildConfig = require("./guildsConfig.json");

//dotenv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, OPENAI_KEY } = process.env;

//importação de comandos
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

const fs = require("node:fs");
const path = require("node:path");
const { Console } = require("node:console");
const commandsPath = path.join(__dirname, "comandos");
const commandsFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandsFiles) {
	const filePath = path.join(commandsPath, file);
	const commands = require(filePath);

	if ("data" in commands && "execute" in commands) {
		client.commands.set(commands.data.name, commands);
	} else {
		console.log(
			`Esse comando em ${filePath} não contem os atributos data nem execute`
		);
	}
}

// Login do Bot
client.once("ready", (c) => {
	console.log(`Pronto! Logado em ${c.user.tag}`);
});

//Listener de interações com o bot

// const CHANNELS_BOT = guildConfig.map((data) => data.canalBot);

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;


	const guildId = interaction.guildId;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`O comando ${interaction.commandName} não foi encontrado.`);
		return;
	}

	try {
		await command.execute(interaction, guildId, guildConfig);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "Ocorreu um erro ao executar esse comando!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "Ocorreu um erro ao executar esse comando!",
				ephemeral: true,
			});
		}
	}
});

//apagar sala privativa
client.on("voiceStateUpdate", async (oldChannel, newChannel) => {
	if (oldChannel) {
		if (!newChannel.channel || (newChannel.channel && oldChannel.channel)) {
			if (
				`${oldChannel.channel.name}` === `🤫│${oldChannel.member.displayName}`
			) {
				oldChannel.channel.delete();
			}
		}
	}
});

// Interação Chat-GPT

const CHANNELS_GPT = guildConfig.map((data) => data.gptChannel);

const openai = new OpenAI({
	apiKey: OPENAI_KEY,
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (
		!CHANNELS_GPT.includes(message.channelId) &&
		!message.mentions.users.has(client.user.id)
	)
		return;

	await message.channel.sendTyping();

	const sendTypingInterval = setInterval(() => {
		message.channel.sendTyping();
	}, 5000);

	const conversation = [];
	conversation.push({
		role: "system",
		content: "Katrick é um ChatBot amigável.",
	});

	let prevMessages = await message.channel.messages.fetch({ limit: 10 });

	prevMessages.reverse();

	prevMessages.forEach((msg) => {
		if (message.author.bot && message.author.id !== client.user.id) return;

		const username = msg.author.username
			.replace(/\s+/g, "_")
			.replace(/[^\w\s]/gi, "");

		if (message.author.id === client.user.id) {
			conversation.push({
				role: "assistant",
				name: username,
				content: message.content,
			});
			return;
		}

		conversation.push({
			role: "user",
			name: username,
			content: message.content,
		});
	});

	const res = await openai.chat.completions
		.create({
			model: "gpt-3.5-turbo",
			messages: conversation,
		})
		.catch((err) => console.log("OpenAi Error\n: ", err));

	if (!res) {
		message.reply(
			"Estou tendo problemas de conexão com a OpenAI. Por favor, tente novamente após alguns minutos."
		);
	}

	clearInterval(sendTypingInterval);

	const resText = res.choices[0].message.content;
	const chunkSizeLimit = 2000;

	for (let i = 0; i < resText.length; i += chunkSizeLimit) {
		const chunk = resText.substring(i, i + chunkSizeLimit);
		await message.reply(chunk);
	}
});


client.login(TOKEN);
