const { SlashCommandSubcommandBuilder } = require("discord.js");
import("@discordjs/voice");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("private")
		.setDescription(
			"Cria um canal de voz, na categoria 🔐, que só você consegue ver e conectar."
		),

	async execute(e, guildId, guildConfig) {

		let voiceState = e.member.voice;
		if (!voiceState.channel) {
			await e.reply(
				"Você precisa estar conectado em qualquer canal de voz para usar esse comando!"
			);
			return;
		}

		let user = e.member.displayName;
		const isChannel = e.guild.channels.cache.find(
			(channel) => channel.name === `🤫│${user}`
		);
		// await e.guild.roles.create({
		//   name: user,
		//   color: "#FF00FF",
		// });

		// Encontre o objeto em guildConfig com a propriedade guildId igual a guildId
		const guildConfigEntry = guildConfig.find(
			(entry) => entry.guildId === guildId
		);

		if (!guildConfigEntry) {
			await e.reply("Configuração não encontrada para este servidor.");
			return;
		}
		// Acesse a propriedade secretChannelCategory para obter o valor do parent
		const parentCategoryId = guildConfigEntry.secretChannelCategory;

		if (!isChannel) {
			await e.guild.channels.create({
				name: `🤫│${user}`,
				type: 2,
				permissionOverwrites: [
					{
						id: e.user.id,
						allow: [
							"0x0000000000000010",
							"0x0000000001000000",
							"0x0000000000000400",
							"0x0000000000100000",
						],
					},
					{
						id: guildId,
						deny: ["0x0000000000100000", "0x0000000000000400"],
					},
				],
				parent: parentCategoryId,
			});

			const voiceChannel = await e.guild.channels.cache.find(
				(channel) => channel.name === `🤫│${user}`
			);

			const member = e.member;
			member.voice.setChannel(voiceChannel);
		} else {
			const voiceChannel = await e.guild.channels.cache.find(
				(channel) => channel.name === `🤫│${user}`
			);
			const member = e.member;
			member.voice.setChannel(voiceChannel);
		}
		await e.reply("Pronto");

		return;
	},
};
