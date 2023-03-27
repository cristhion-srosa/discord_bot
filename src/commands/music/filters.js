const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, lazy } = require("discord.js")
const Command = require("../../structures/Command")
const { connected, playing } = require("../../utils/verify")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "filters",
      description: "Altera os filtros da música!",
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: "filter",
          description: "Filtros disponíveis",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            {
              name: "lLimpar Filtros",
              value: "clear",
            },
            {
              name: "Bass",
              value: "bass"
            },
            {
              name: "Night Core",
              value: "nightcore"
            },
            {
              name: "Pitch",
              value: "pitch"
            },
            {
              name: "8D",
              value: "8d",
            },
            {
              name: "Bassboost",
              value: "bassboost"
            },
            {
              name: "speed",
              value: "speed"
            },
            {
              name: "Vaporwave",
              value: "vaporwave"
            }
          ]
        }
      ]
    })
  }

  run = async (interaction) => {
    const isConnected = await connected(interaction)
    if(!isConnected) return

    const filter = interaction.options.getString("filter")

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await playing(player, interaction)
    if(!isPlaying) return

    let filterEmbed = new EmbedBuilder()
      .setColor(this.client.embedColor)
      .setTimestamp()
      .setTitle(`Modo ${filter} ativado`)

    switch (filter) {
      case 'bass':
        player.setBassboost(true)
      break
      case 'bassboost': 
        let bands = new Array(7).fill(null).map((_, i) => ({ band: i, gain: 0.25 }))
        player.setEQ( ...bands)
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
      case "clear":
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
    const reply = await interaction.reply({ embeds: [filterEmbed], fetchReply: true})

    deleteMessage(reply, 60000)
  }
}
