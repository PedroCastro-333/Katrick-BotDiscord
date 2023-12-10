// addUsersOnDb.js
const db = require("./db");
const logger = require("../logger");

async function addUsersToDatabase(guild) {
	const client = await db.connect();

	try {
		const members = await guild.members.fetch();

		for (const member of members.values()) {
			// Verifique se o membro não é um bot
			if (!member.user.bot) {
				const query = `
                    INSERT INTO usuarios (id, pontos, mortes, sobrevidas)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (id) DO NOTHING
                `;
				const values = [member.user.id, 1000, 0, 0];

				await client.none(query, values);
				logger.info(`Usuário ${member.user.tag} adicionado ao banco de dados.`);
			}
		}
	} catch (error) {
		console.error("Erro ao adicionar usuários ao banco de dados:", error);
	} finally {
		client.done();
	}
}

module.exports = { addUsersToDatabase };
