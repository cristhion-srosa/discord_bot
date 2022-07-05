const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")

const { connectedChannel } = require("../../utils/verify.js")

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
    
    if(!player){
      return await interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle(`Nada tocando no momento!`),
          ],
          ephemeral: true,
        }).catch(() => {})
    }
    if (player.state !== "CONNECTED" || !player.queue || !player.queue.current) {
      player.destroy()
      return await interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle(`Nada tocando no momento!`),
          ],
          ephemeral: true,
        }).catch(() => {})
    }

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
