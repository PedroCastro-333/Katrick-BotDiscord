const { SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("ping")
    .setDescription("Responde com pong"),

  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
