const { MessageEmbed } = require("discord.js")
module.exports = {
  connectedChannel: async function (interaction) {
    if (!interaction.member.voice.channel) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: `Você precisa estar em um canal de voz para usar esse comando!!` }),
        ],
        ephemeral: true,
      })
      return false
    }
    if ( interaction.guild.me.voice.channel && interaction.guild.me.voice.channel.id !== interaction.member.voice.channel.id ) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: `Você precisa estar no mesmo canal de voz que eu para utilizar este comando!` }),
        ],
        ephemeral: true,
      })
      return false
    }
    return true
  },
}
