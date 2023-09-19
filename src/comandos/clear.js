const {
	SlashCommandSubcommandBuilder,
	PermissionsBitField,
	EmbedBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("clear")
		.setDescription("Limpe as mensagens do chat")
		.addIntegerOption((opt) =>
			opt
				.setName("quantidade")
				.setDescription("Quantidade de mensagens para apagar")
				.setMinValue(1)
				.setRequired(true)
		),

	async execute(interaction, client) {
		const quantidade = interaction.options.getInteger("quantidade");
		const channel = interaction.channel;

		if (!interaction.member.permissions.has(PermissionsBitField.ManageMessages))
			return await interaction.reply({
				content: "Você não tem permissão para executar esse comando.",
				ephemeral: true,
			});
		if (!quantidade)
			return await interaction.reply({
				content:
					"Por favor defina uma quantiadade de mensagens a serem apagadas.",
				ephemeral: true,
			});

		await channel.bulkDelete(quantidade).catch((err) => {
			return;
		});

		const embed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setDescription(
				`:white_check_mark: **${quantidade}** mensagens apagadas recentemente.`
			);

		await interaction.reply({ embeds: [embed] });
	},
};
