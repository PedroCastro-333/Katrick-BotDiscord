// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

//guildConfig
const guildConfig = require("./guildsConfig.json");

//dotenv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN } = process.env;

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

//importação de comandos
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

// Criar sala

client.on("voiceStateUpdate", async (oldChannel, newChannel) => {
	if (
		oldChannel.channel ||
		newChannel.channel ||
		!oldChannel.channel ||
		!newChannel.channel
	) {
		if (!oldChannel.channel && newChannel.channel) {
			const guildId = newChannel.guild.id;
			const guildConfigEntry = guildConfig.find(
				(entry) => entry.guildId === guildId
			);

			if (newChannel.channel.id === guildConfigEntry.criarSalaPrivada) {
				// Encontre o objeto em guildConfig com a propriedade guildId igual a guildId

				if (!guildConfigEntry) {
					await e.reply("Configuração não encontrada para este servidor.");
					return;
				}
				// Acesse a propriedade secretChannelCategory para obter o valor do parent
				const parentCategoryId = guildConfigEntry.secretChannelCategory;

				// Pegue o usuario de quem usou o comando
				const user = newChannel.guild.members.cache.find(
					(user) => user.id === newChannel.id
				).nickname;

				const isChannel = newChannel.guild.channels.cache.find(
					(channel) => channel.name === `🤫│${user}`
				);

				if (!isChannel) {
					await newChannel.channel.guild.channels.create({
						name: `🤫│${user}`,
						type: 2,
						permissionOverwrites: [
							{
								id: newChannel.id,
								allow: [
									"0x0000000000000010", //MANAGE_CHANNELS
									"0x0000000001000000", //MOVE_MEMBERS
									"0x0000000000000400", //VIEW_CHANNEL
									"0x0000000000100000", //0x0000000000100000
								],
							},
							{
								id: guildId,
								deny: ["0x0000000000100000", "0x0000000000000400"],
							},
						],
						parent: parentCategoryId,
					});

					const voiceChannel = await newChannel.guild.channels.cache.find(
						(channel) => channel.name === `🤫│${user}`
					);
					newChannel.setChannel(voiceChannel);
				} else {
					const voiceChannel = await newChannel.guild.channels.cache.find(
						(channel) => channel.name === `🤫│${user}`
					);
					newChannel.setChannel(voiceChannel);
				}
			} else if (newChannel.channel.id === guildConfigEntry.criarSalaPublica) {
				// Encontre o objeto em guildConfig com a propriedade guildId igual a guildId

				if (!guildConfigEntry) {
					await e.reply("Configuração não encontrada para este servidor.");
					return;
				}
				// Acesse a propriedade secretChannelCategory para obter o valor do parent
				const parentCategoryId = guildConfigEntry.secretChannelCategory;

				// Pegue o usuario de quem usou o comando
				const user = newChannel.guild.members.cache.find(
					(user) => user.id === newChannel.id
				).nickname;

				const isChannel = newChannel.guild.channels.cache.find(
					(channel) => channel.name === `🟢│ Bate papo do ${user}`
				);

				if (!isChannel) {
					await newChannel.channel.guild.channels.create({
						name: `🟢│ Bate papo do ${user}`,
						type: 2,
						permissionOverwrites: [
							{
								id: newChannel.id,
								allow: [
									"0x0000000000000010", //MANAGE_CHANNELS
									"0x0000000001000000", //MOVE_MEMBERS
									"0x0000000000100000", //0x0000000000100000
								],
							},
						],
						parent: parentCategoryId,
					});

					const voiceChannel = await newChannel.guild.channels.cache.find(
						(channel) => channel.name === `🟢│ Bate papo do ${user}`
					);
					newChannel.setChannel(voiceChannel);
				} else {
					const voiceChannel = await newChannel.guild.channels.cache.find(
						(channel) => channel.name === `🟢│ Bate papo do ${user}`
					);
					newChannel.setChannel(voiceChannel);
				}
			}
		}
	}
});

// Apagar sala privativa
client.on("voiceStateUpdate", async (oldChannel, newChannel) => {
	if (oldChannel) {
		if (!newChannel.channel || (newChannel.channel && oldChannel.channel)) {
			if (
				`${oldChannel.channel.name}` ===
					`🤫│${oldChannel.member.displayName}` ||
				`${oldChannel.channel.name}` === `🟢│ Bate papo do ${oldChannel.member.displayName}`
			) {
				oldChannel.channel.delete();
			}
		}
	}
});

client.login(TOKEN);
