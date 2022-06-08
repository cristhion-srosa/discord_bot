const Command = require("../../structures/Command");

const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "say",
      description: "Faz com que o bot diga alguma mensagem.",
      options: [
        {
          name: "mensagem",
          type: "STRING",
          description: "A mensagem a ser enviada.",
          required: true,
        },
      ],
    });
  }

  run = async (interaction) => {
    if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
      return interaction.reply({
        content: "Você não tem permisão para usar esse comand!",
        ephemeral: true,
      });

    const channels = interaction.guild.channels.cache.filter(
      (c) =>
        c.type === "GUILD_TEXT" &&
        c
          .permissionsFor(this.client.user.id)
          .has(["SEND_MESSAGES", "EMBED_LINKS"]) &&
        c.permissionsFor(interaction.user.id).has(["SEND_MESSAGES"])
    );

    if (!channels.size)
      return interaction.reply({
        content: "Não consigo enviar a mensagem nos canais desse servidor!",
        ephemeral: true,
      });

    const actionRow = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .setCustomId("channelSelect")
        .setPlaceholder("Canais")
        .addOptions([
          channels.map((c) => {
            return {
              label: c.name,
              value: c.id,
            };
          }),
        ]),
    ]);

    const reply = await interaction.reply({
      content: "**Escolha um canal**",
      components: [actionRow],
      fetchReply: true,
      ephemeral: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = reply.createMessageComponentCollector({
      filter,
      max: 1,
      time: 3 * 60000,
    });

    collector.on("collect", (i) => {
      const channelId = i.values[0];
      const channel = interaction.guild.channels.cache.get(channelId);

      const text = interaction.options.getString("mensagem");

      const embed = new MessageEmbed()
        .setTitle(`Recado de ${interaction.user.username}:`)
        .addField(text, "\u200B", true)
        .setColor("#0000ff")
        .setTimestamp();

      channel
        .send({ embeds: [embed] })
        .then(() =>
          interaction.editReply({
            content: `Mensagem enviada com sucesso em ${channel.toString()}.`,
            ephemeral: true,
            components: [],
          })
        )
        .catch(() =>
          interaction.editReply({
            content: `ERRO | Erro ao enviar mensagem no canal.`,
            ephemeral: true,
            components: [],
          })
        );
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time")
        interaction.editReply({
          content: "O tempo para informar um canal se esgotou!",
          components: [],
        });
    });
  };
};
