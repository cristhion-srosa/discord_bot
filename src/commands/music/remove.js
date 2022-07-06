const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")
const { connectedChannel, somethingPlaying } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "remove",
      description: "Remove a música da fila",
      options: [
        {
          name: "number",
          description: "Número da música na fila",
          required: true,
          type: "NUMBER",
        },
      ],
    })
  }

  run = async (interaction) => {
    const isConnected = await connectedChannel(interaction)
    if(!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await somethingPlaying(player,interaction)
    if(!isPlaying) return

    let args = interaction.options.getNumber("number")

    args = (Number(args) - 1)
    if (args > player.queue.size) {
      return await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle(`Nenhuma música na posição ${args + 1}! | Quantidade de músicas na fila: ${player.queue.length}`),
        ],
        ephemeral: true,
      })
    }

    const song = player.queue[args]
    player.queue.remove(song)

    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(this.client.embedColor)
          .setTitle(`${song.title} removida!`)
          .setURL(song.uri)
          .setTimestamp()
      ]
    })
  }
}
