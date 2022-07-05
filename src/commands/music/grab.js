const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")

const { convertTime } = require("../../utils/convert.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "grab",
      description: "Envia a música que esta tocando pra o seu privado",
    })
  }

  run = async (interaction) => {
    const player = this.client.manager.get(interaction.guild.id)

    if (!player) {
      return await interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle(`Nada tocando no momento!`),
          ],
          ephemeral: true,
        })
        .catch(() => {})
    }
    if ( player.state !== "CONNECTED" || !player.queue || !player.queue.current ) {
      player.destroy()

      return await interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle(`Nada tocando no momento!`),
          ],
          ephemeral: true,
        })
        .catch(() => {})
    }

    const dmbut = new MessageButton()
      .setLabel("Abrir DM no navegador")
      .setStyle("LINK")
      .setURL(`https://discord.com/users/${this.client.id}`)
    const row = new MessageActionRow().addComponents(dmbut)

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          })
          .setTitle(`Enviado na DM!`)
          .setColor(this.client.embedColor)
          .setFooter({ text: `Requisitado por ${interaction.user.tag}` })
          .setTimestamp(),
      ],
      components: [row],
    })

    const user = this.client.users.cache.get(interaction.member.user.id)

    return user.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Música: ${player.queue.current.title}`)
          .addFields(
            {
              name: `Duração: `,
              value: `${convertTime(player.queue.current.duration)}`,
              inline: true,
            },
            {
              name: "Pedido por: ",
              value: `${player.queue.current.requester.tag.toString()}.`,
              inline: true,
            }
          )
          .setColor("BLUE")
          .setURL(player.queue.current.uri)
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Abrir no navegador")
            .setStyle("LINK")
            .setURL(player.queue.current.uri)
        ),
      ],
    })
  }
}
