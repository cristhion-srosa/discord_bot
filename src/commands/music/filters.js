const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")
const { connectedChannel, somethingPlaying } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "filters",
      description: "Altera os filtros da música",
      options: [
        {
          name: "filter",
          description: "Filtros disponíveis",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "Limpar filtros",
              value: "clear",
            },
            {
              name: "Bass",
              value: "bass",
            },
            {
              name: "Night Core",
              value: "nightcore",
            },
            {
              name: "Pitch",
              value: "pitch",
            },
            {
              name: "8D",
              value: "8d",
            },
            {
              name: "Bassboost",
              value: "bassboost",
            },
            {
              name: "Speed",
              value: "speed",
            },
            {
              name: "Vaporwave",
              value: "vaporwave",
            },
          ],
        },
      ],
    })
  }

  run = async (interaction) => {
    const isConnected = await connectedChannel(interaction)
    if(!isConnected) return

    const filter = interaction.options.getString("filter")

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await somethingPlaying(player,interaction)
    if(!isPlaying) return
    
    let filterEmbed = new MessageEmbed()
      .setColor(this.client.embedColor)
      .setTimestamp()
      filterEmbed.setTitle(`Modo ${filter} ativado`)
    switch (filter){
      
      case 'bass':
        player.setBassboost(true)
        break
      case 'bassboost':
        var bands = new Array(7).fill(null).map((_, i) => ({ band: i, gain: 0.25 }));
        player.setEQ(...bands);
        break
      case 'nightcore':
        player.setNightcore(true)
        break
      case 'pitch':
        player.setPitch()
        break
      case 'vaporwave':
        player.setVaporwave(true)
        break
      case 'clear':
        player.clearEffects()
        filterEmbed.setTitle(`Filtros limpos!`)
        break
      case 'speed':
        player.setSpeed()
        break
      case '8d':
        player.set8D()
        break
    }
    const reply = await interaction.reply({ embeds: [filterEmbed] })
    setTimeout(() => {
      if(reply) reply.delete()
    }, 1 * 60000);
    return 
  }
}
