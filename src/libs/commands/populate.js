const {
	SlashCommandSubcommandBuilder,
	PermissionsBitField,
} = require("discord.js");
const { addUsersToDatabase } = require("../database/populateDb");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("populate")
		.setDescription(
			"Popula base de dados com todos os membros já existentes no servidor."
		),

	async execute(interaction) {
		try {
			// Verifica se o membro que executou o comando tem a permissão de gerenciar membros
			const member = interaction.member;
			if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				return await interaction.reply({
					content: "Você não tem permissão para usar este comando.",
					ephemeral: true, // A resposta será visível apenas para o usuário que executou o comando
				});
			}

			const guild = interaction.guild;
			await addUsersToDatabase(guild);
			await interaction.reply({
				content: "Usuários adicionados ao banco de dados com sucesso.",
				ephemeral: true,
			});
		} catch (error) {
			console.error("Erro ao adicionar usuários ao banco de dados:", error);
			await interaction.reply({
				content: "Ocorreu um erro ao adicionar usuários ao banco de dados.",
				ephemeral: true,
			});
		}
	},
};
