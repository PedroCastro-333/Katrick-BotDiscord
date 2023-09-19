const { SlashCommandSubcommandBuilder, EmbedBuilder } = require("discord.js");

const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Desativando chat do LOL")
  .addFields(
    {
      name: "|",
      value: "Abra o CMD como administrador e cole o comando abaixo",
    },
    {
      name: "\u200B",
      value: "\u200B",
    },
    {
      name: "Comando para desativar",
      value:
        "netsh advfirewall firewall add rule name='lolchat' dir=out remoteport=5223 protocol=TCP action=block",
    },

    {
      name: "Comando para ativar",
      value: "netsh advfirewall firewall delete rule name='lolchat'",
    }
  );

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("chat-lol")
    .setDescription("Como desativar o chat do LOL"),

  async execute(interaction) {
    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
