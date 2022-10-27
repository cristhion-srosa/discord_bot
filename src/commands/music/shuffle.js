const { EmbedBuilder, ApplicationCommandType } = require("discord.js")
const Command = require("../../structures/Command")
const { connected, playing } = require("../../utils/verify")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "shuffle",
      description: "Embaralha a fila de músicas",
      type: ApplicationCommandType.ChatInput
    })
  }

  run = async (interaction) => {
    const isConnected = await connected(interaction)
    if (!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await playing(player, interaction)
    if (!isPlaying) return

    player.queue.shuffle()

    let message = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(this.client.errorColor)
          .setTitle(`Fila embaralhada!`)
          .setTimestamp()
      ],
      fetchReply: true
    })
    deleteMessage(message, 60000)
    return
  }
}