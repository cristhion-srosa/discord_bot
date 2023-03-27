const { EmbedBuilder, ApplicationCommandType } = require("discord.js")
const Command = require("../../structures/Command")
const { connected, playing } = require("../../utils/verify")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "pause",
      description: "Pausa a música que está tocando",
      type: ApplicationCommandType.ChatInput
    })
  }

  run = async (interaction) => {
    const isConnected = await connected(interaction)
    if (!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)
    
    const isPlaying = await playing(player, interaction)
    if (!isPlaying) return

    if (player.paused) {
      let message = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(this.client.errorColor)
            .setTitle("A música já está pausada!")
            .setDescription("A música já está pausada!")
            .setTimestamp()
        ],
        fetchreply: true
      })
      deleteMessage(message, 60000)
      return
    }

    player.pause(true)

    let message = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(this.client.errorColor)
          .setTitle("Música pausada!")
          .setTimestamp()
      ],
      fetchReply: true
    })
    deleteMessage(message, 60000)
  }
}