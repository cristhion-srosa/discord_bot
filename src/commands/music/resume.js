const { EmbedBuilder, ApplicationCommandType } = require("discord.js")
const Command = require ("../../structures/Command")
const { connected, playing } = require("../../utils/verify")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      description: "volta a tocar a música que foi pausada!",
      type: ApplicationCommandType.ChatInput
    })
  }

  run = async (interaction) => {
    const isConnected = await connected(interaction)
    if (!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await playing(player, interaction)
    if(!isPlaying) return

    if(!player.paused) {
      let message = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(this.client.errorColor)
            .setTitle("A música não está pausada!")
            .addFields({name: 'Confira se o bot não está mutado!', value: 'Use /pause para pausar a música'})
            .setTimestamp()
        ],
        fetchReply: true
      })
      deleteMessage(message, 60000)
      return
    }

    player.pause(false)

    let message = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(this.client.embedColor)
          .setTitle(`Voltando a tocar [${player.queue.current.title}]`)
          .setURL(player.queue.current.uri)
      ],
      fetchReply: true
    })
    deleteMessage(message, 60000)
  }
}