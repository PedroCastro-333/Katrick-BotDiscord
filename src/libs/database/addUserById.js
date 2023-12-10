// addUsersOnDb.js
const db = require("./db");
const logger = require("../logger");

async function addUserById(guild, memberId) {
	const client = await db.connect();

	try {
		// Obtenha o membro usando o ID
		const member = await guild.members.fetch(memberId);

		if (member && !member.user.bot) {
			const query = `
                INSERT INTO usuarios (id, pontos, mortes, sobrevidas)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id) DO NOTHING
            `;
			const values = [member.user.id, 1000, 0, 0];

			await client.none(query, values);
		}
	} catch (error) {
		console.error("Erro ao adicionar usuário ao banco de dados:", error);
	} finally {
		client.done();
	}
}

module.exports = { addUserById };
