const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")
const { connectedChannel, somethingPlaying } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      description: "Volta a tocar a música que foi pausada",
    })
  }

  run = async (interaction) => {
    const isConnected = await connectedChannel(interaction)
    if (!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await somethingPlaying(player,interaction)
    if(!isPlaying) return

    if (!player.paused) {
      return await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("A música não está pausada")
            .addField("Confira se o bot não está mutado!\n", "Use /pause para pausar a música!", true ) 
            .setTimestamp(),
        ],
      })
    }

    player.pause(false)

    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(this.client.embedColor)
          .setDescription(`**Voltando a tocar [${player.queue.current.title}](${player.queue.current.uri})**`)
      ],
    })
  }
}
