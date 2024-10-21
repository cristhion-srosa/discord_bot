const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ApplicationCommandType} = require("discord.js")
const Command = require("../../structures/Command")
const {convertTime} = require("../../utils/convert.js")
const {playing} = require("../../utils/verify.js")
const {deleteMessage} = require("../../utils/timeout")

module.exports = class extends Command{
  constructor(client){
    super(client,{
      name: "grab",
      description: "Envia a música que esta tocando para o seu privado",
      type: ApplicationCommandType.ChatInput
    })
  }

  run = async(interaction) => {
    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await playing(player,interaction)
    if(!isPlaying) return
    const dmbut = new ButtonBuilder()
    .setLabel("Abrir DM no Navegador")
    .setStyle("Link")
    .setURL(`https://discord.com/users/${this.client.id}`)
    const row = new ActionRowBuilder().addComponents(dmbut)

    let message = await interaction.reply({
      embeds: [
        new EmbedBuilder().setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.avatarURL()
        })
        .setTitle("Enviado na DM!")
        .setColor(this.client.embedColor)
        .setFooter({text: `Requisitado por ${interaction.user.tag}`})
        .setTimestamp()
      ],
      components: [row],
      fetchReply: true,
      ephemeral: true
    })

    deleteMessage(message, 60000)

    const user = this.client.users.cache.get(interaction.member.user.id)

    return user.send({
      embeds: [
        new EmbedBuilder()
        .setTitle(`${player.queue.current.title}`)
        .addFields(
        {
          name: `Duração: `,
          value: `${convertTime(player.queue.current.duration)}`,
          inline: true,
        },
        {
          name: `Pedido por: `,
          value: `${player.queue.current.requester}`,
          inline: true,
        }
        )
        .setColor(this.client.embedColor)
        .setURL(player.queue.current.uri)
      ],
      components:[
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setLabel("Abrir no navegador")
          .setStyle("Link")
          .setURL(player.queue.current.uri)
        )
      ]
    })
  }

}