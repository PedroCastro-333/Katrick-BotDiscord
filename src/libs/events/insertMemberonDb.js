const { addUserById } = require("../database/addUserById");
const logger = require("../logger");

module.exports = async (member) => {
	try {
		await addUserById(member.guild, member.user.id);
		logger.info(`Usuário ${member.user.tag} foi adicionado com sucesso`);
	} catch(error) {
		console.error("Erro ao adicionar usuários ao banco de dados:", error);
	}
};
