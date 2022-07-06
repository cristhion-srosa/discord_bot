const { MessageEmbed } = require("discord.js")
module.exports = {
  connectedChannel: async function (interaction) {
    if (!interaction.member.voice.channel) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle(
              `Você precisa estar em um canal de voz para usar esse comando!!`
            ),
        ],
        ephemeral: true,
      })
      return false
    }
    if (interaction.guild.me.voice.channel &&interaction.guild.me.voice.channel.id !==interaction.member.voice.channel.id) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle(
              `Você precisa estar no mesmo canal de voz que eu para utilizar este comando!`
            ),
        ],
        ephemeral: true,
      })
      return false
    }
    return true
  },
  somethingPlaying: async function (player, interaction) {
    if (!player || !player.queue ||!player.queue.current) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle(`Nada tocando no momento!`),
        ],
        ephemeral: true,
      }).catch(() => {})
      return false
    }
    return true
  },
}
