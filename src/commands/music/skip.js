const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")
const { connectedChannel, somethingPlaying } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "skip",
      description: "Pula a música que está tocando",
    })
  }

  run = async (interaction) => {
    const isConnected = await connectedChannel(interaction)
    if(!isConnected) return
    
    const player = this.client.manager.get(interaction.guild.id)
    
    const isPlaying = await somethingPlaying(player,interaction)
    if(!isPlaying) return

    player.stop()
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RED")
          .setDescription(`**Música pulada: [${player.queue.current.title}](${player.queue.current.uri})**`),
      ],
    })
  }
}
