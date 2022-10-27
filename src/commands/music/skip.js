const {EmbedBuilder, ApplicationCommandType} = require("discord.js")
const Command = require("../../structures/Command")
const { connected, playing} = require("../../utils/verify.js")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Command {
  constructor(client){
    super(client,{
      name: "skip",
      description: "Pula a música que está tocando",
      type: ApplicationCommandType.ChatInput
    })
  }

  run = async (interaction) => {
    const isConnected = await connected(interaction)
    if (!isConnected) return
    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await playing(player, interaction)
    if(!isPlaying) return

    player.stop()

    let message = await interaction.reply({
      embeds:[
        new EmbedBuilder()
          .setColor(this.client.errorColor)
          .setDescription(`**Música pulada: [${player.queue.current.title}](${player.queue.current.uri})**`)
      ],
      fetchReply: true
    })
    deleteMessage(message, 60000)
}
}
