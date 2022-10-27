const { EmbedBuilder } = require("discord.js")
module.exports = {
  connected: async function (interaction) {
    if(!interaction.guild) {
      return
    }
    if (!interaction.member.voice.channel) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`Você precisa estar em um canal de voz para usar esse comando!!`),
        ],
        ephemeral: true,
      })
      return false
    }
    
    if (interaction.guild.myVoiceChannel &&interaction.guild.myVoiceChannel.id !== interaction.member.myVoiceChannel.id) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`Você precisa estar no mesmo canal de voz que eu para utilizar este comando!`),
        ],
        ephemeral: true,
      })
      return false
    }
    return true
  },
  playing: async function (player, interaction) {
    if (!player || !player.queue ||!player.queue.current) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`Nada tocando no momento!`),
        ],
        ephemeral: true,
      }).catch(() => {})
      return false
    }
    return true
  },
}
