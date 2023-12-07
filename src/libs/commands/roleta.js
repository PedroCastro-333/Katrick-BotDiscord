// roletaModule.js
const { SlashCommandSubcommandBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("roleta")
		.setDescription("Aposte seus pontos. Receba o dobro ou perca tudo!")
		.addStringOption((opt) =>
			opt
				.setName("quantidade")
				.setDescription(
					"Quantidade de pontos a apostar ('all' para apostar todos os pontos)"
				)
				.setRequired(true)
		),

	async execute(interaction, userId) {
		try {
			// Verifica se o usuário tem pontos suficientes
			const user = await db.oneOrNone(
				"SELECT * FROM usuarios WHERE id = $1",
				userId
			);
			if (!user || user.pontos === 0) {
				await interaction.reply(
					"Você não tem pontos suficientes para usar na roleta."
				);
				return;
			}

			// Obtém a quantidade apostada
			const quantidade = interaction.options.getString("quantidade");

			// Verifica se a quantidade é 'all' para apostar todos os pontos
			let quantidadeApostada;
			if (quantidade.toLowerCase() === "all") {
				quantidadeApostada = user.pontos;
			} else {
				// Verifica se a quantidade é um número inteiro maior ou igual a 1
				if (!(/^\d+$/.test(quantidade) && parseInt(quantidade) >= 1)) {
					await interaction.reply(
						"Por favor, insira uma quantidade válida (um número inteiro maior ou igual a 1 ou 'all' para apostar todos os pontos)."
					);
					return;
				}

				// Converte a quantidade para um número
				quantidadeApostada = parseInt(quantidade);
			}

			// Simula a roleta (50% de chance de ganhar)
			const resultado = Math.random() < 0.5 ? "ganhou" : "perdeu";

			// Atualiza os pontos do usuário com base no resultado
			const novoSaldo =
				resultado === "ganhou"
					? user.pontos + quantidadeApostada
					: user.pontos - quantidadeApostada;

			// Atualiza os dados do usuário no banco de dados
			await db.none("UPDATE usuarios SET pontos = $1 WHERE id = $2", [
				novoSaldo,
				userId,
			]);

			// Formata o saldo com pontos separando os milhares
			const saldoFormatado = novoSaldo.toLocaleString();

			await interaction.reply(
				`Você apostou ${
					quantidadeApostada === user.pontos ? "todos os" : quantidadeApostada
				} pontos e ${
					resultado === "ganhou" ? "ganhou" : "perdeu"
				}! Seu novo saldo é ${saldoFormatado} pontos.`
			);
		} catch (error) {
			console.error("Erro ao executar o comando da roleta:", error);
			await interaction.reply(
				"Ocorreu um erro ao executar o comando da roleta."
			);
		}
	},
};
