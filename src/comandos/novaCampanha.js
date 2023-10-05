const { SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("novacampanha")
		.setDescription("Cria uma nova campanha e atribui um cargo a ela.")
		.addStringOption((opt) =>
			opt
				.setName("nome_campanha")
				.setDescription("Nome da nova campanha.")
				.setRequired(true)
		),

	async execute(
		interaction = interaction,
		guildId = guildId,
		guildConfig = guildConfig
	) {
		// CONSTANTES
		const nomeCampanha = interaction.options.getString("nome_campanha");
		const guild = interaction.guild;
		const mestre = interaction.member.user.id;

		//INICIO DA EXECUÇÃO

		// Crie o cargo para a campanha.
		const cargoCampanhaGeral = await guild.roles.create({
			name: nomeCampanha,
			color: 16711680, // 16711680 represents red in base 10
		});
		const cargoCampanhaMestre = await guild.roles.create({
			name: nomeCampanha + "-mestre",
			color: 16711680, // 16711680 represents red in base 10
		});

		await interaction.member.roles.add(cargoCampanhaMestre.id);

		// Crie a categoria para a campanha.
		const rpgCategory = await guild.channels.create({
			name: `╭────  🧙 ${nomeCampanha}`,
			type: 4,
			position: 0,
			permissionOverwrites: [
				{
					id: cargoCampanhaMestre.id,
					allow: [
						"0x0000000000000400", //VIEW_CHANNEL
						"0x0000000000000200", //STREAM
						"0x0000000000000010", //MANAGE_CHANNELS *
						"0x0000000000000800", //SEND MESSAGES
						"0x0000000000002000", //MANAGE_MESSAGES *
						"0x0000000000008000", //ATTACH_FILES
						"0x0000000000100000", //CONNECT
						"0x0000000000200000", //SPEAK
						"0x0000000000400000", //MUTE MEMBER
						"0x0000000001000000", //MMOVE MEMBER
						"0x0000000004000000", //CHANGE NICKNAME
						"0x0000000008000000", //MANAGE NICKNAME
					],
				},
				{
					id: cargoCampanhaGeral.id,
					allow: [
						"0x0000000000000400", //VIEW_CHANNEL
						"0x0000000000000200", //STREAM
						"0x0000000000000800", //SEND MESSAGES
						"0x0000000000008000", //ATTACH_FILES
						"0x0000000000100000", //CONNECT
						"0x0000000000200000", //SPEAK
					],
				},
				{
					id: guildId,
					deny: ["0x0000000000100000", "0x0000000000000400"],
				},
			],
		});

        // Criar canais
		const rpgVoz = await interaction.guild.channels.create({
			name: `🎲 | ${nomeCampanha}`,
			type: 2,
			parent: rpgCategory.id,
		});
		const rpgText = await interaction.guild.channels.create({
			name: `💬-${nomeCampanha}`,
			type: 0,
			parent: rpgCategory.id,
		});
		const rpgRolagemMestre = await interaction.guild.channels.create({
			name: `⚠-exclusivo-do-mestre`,
			type: 0,
			parent: rpgCategory.id,
			permissionOverwrites: [
				{
					id: cargoCampanhaMestre.id,
					allow: [
						"0x0000000000000400", //VIEW_CHANNEL
						"0x0000000000000200", //STREAM
						"0x0000000000000010", //MANAGE_CHANNELS *
						"0x0000000000000800", //SEND MESSAGES
						"0x0000000000002000", //MANAGE_MESSAGES *
						"0x0000000000008000", //ATTACH_FILES
						"0x0000000000100000", //CONNECT
						"0x0000000000200000", //SPEAK
						"0x0000000000400000", //MUTE MEMBER
						"0x0000000001000000", //MMOVE MEMBER
						"0x0000000004000000", //CHANGE NICKNAME
						"0x0000000008000000", //MANAGE NICKNAME
					],
				},
				{
					id: cargoCampanhaGeral.id,
					deny: ["0x0000000000100000", "0x0000000000000400"],
				},
				{
					id: guildId,
					deny: ["0x0000000000100000", "0x0000000000000400"],
				},
			],
		});

		await interaction.reply(`Campanha "${nomeCampanha}" criada com sucesso!`);
	},
};
