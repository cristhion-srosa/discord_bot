const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")
const { connectedChannel, somethingPlaying } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "pause",
      description: "Pausa a música que está tocando",
    })
  }

  run = async (interaction) => {
    const isConnected = await connectedChannel(interaction)
    if (!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await somethingPlaying(player,interaction)
    if(!isPlaying) return

    if (player.paused) {
      return await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("A música já está pausada!")
            .setDescription("Use /resume para despausar")
            .setTimestamp(),
        ]
      })
    }

    player.pause(true)

    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RED")
          .setTimestamp()
          .setTitle("Música pausada"),
      ],
    })
  }
}
