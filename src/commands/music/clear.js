const { EmbedBuilder, ApplicationCommandType } = require("discord.js")
const Command = require("../../structures/Command")
const { connected, playing } = require("../../utils/verify")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      description: "Limpa a fila!",
      type: ApplicationCommandType.ChatInput
    })
  }

  run = async (interaction) => {
    const isConnected = await connected(interaction)
    if(!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await playing(player, interaction)
    if(!isPlaying) return

    player.queue.clear()

    let message = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(this.client.errorColor)
          .setTitle(`Fila limpa!`)
      ],
      fetchReply: true
    })
    deleteMessage(message, 60000)
  }
}