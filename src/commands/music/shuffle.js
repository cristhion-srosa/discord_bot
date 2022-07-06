const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")
const { connectedChannel, somethingPlaying } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "shuffle",
      description: "Embaralha a fila de músicas",
    })
  }

  run = async (interaction) => {
    const isConnected = await connectedChannel(interaction)
    if(!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await somethingPlaying(player,interaction)
    if(!isPlaying) return

    player.queue.shuffle()

    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RED")
          .setTitle(`Fila embaralhada!`)
          .setTimestamp(),
      ],
    })
  }
}
