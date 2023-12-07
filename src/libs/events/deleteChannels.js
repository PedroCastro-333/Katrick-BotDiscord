const logger = require("../logger");
const guildConfig = require("../config/guildsConfig.json");

module.exports = async (oldChannel, newChannel) => {
	try {
		if (oldChannel) {
			if (!newChannel.channel || (newChannel.channel && oldChannel.channel)) {
				if (
					`${oldChannel.channel.name}` ===
						`🤫│${oldChannel.member.displayName}` ||
					`${oldChannel.channel.name}` ===
						`🟢│ Bate papo do ${oldChannel.member.displayName}`
				) {
					oldChannel.channel.delete();
				}
			}
		}
	} catch (err) {
		logger.err(err, "An error occured executing a command");
	}
};
