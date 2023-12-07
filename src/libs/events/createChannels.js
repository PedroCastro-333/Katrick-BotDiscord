const logger = require("../logger");
const guildConfig = require("../config/guildsConfig.json");

module.exports = async (oldChannel, newChannel) => {
	try {
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
					).displayName;

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
				} else if (
					newChannel.channel.id === guildConfigEntry.criarSalaPublica
				) {
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
					).displayName;

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
	} catch (err) {
		logger.err(err, "An error occured executing a command");
	}
};
