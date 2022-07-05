const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")

const { connectedChannel } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "loop",
      description: "Altera o estado de repetição da música",
      options: [
        {
          name: "input",
          description: "O que deseja colocar em repetição (música ou fila)",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "track",
              value: "track",
            },
            {
              name: "queue",
              value: "queue",
            },
          ],
        },
      ],
    })
  }

  run = async (interaction) => {
    const isConnected = await connectedChannel(interaction)
    if (!isConnected) return

    const input = interaction.options.getString("input")

    const player = this.client.manager.get(interaction.guild.id)

    if (!player || !player.queue.current) {
      return await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("Nada tocando no momento"),
        ],
        ephemeral: true,
      })
    }

    if (input === "track") {
      if (player.trackRepeat) {
        player.setTrackRepeat(false)
        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle("A música não vai mais repetir!"),
          ],
        })
      } else {
        player.setTrackRepeat(true)
        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(this.client.embedColor)
              .setTitle("A música irá repetir!"),
          ],
        })
      }
    } else if (input === "queue") {
      if (!player.queue.size)
        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle("A fila está vazia!"),
          ],
          ephemeral: true,
        })
      if (player.queueRepeat) {
        player.setQueueRepeat(false)
        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle("A fila não vai mais repetir!"),
          ],
        })
      } else {
        player.setQueueRepeat(true)
        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(this.client.embedColor)
              .setTitle("A fila irá repetir!"),
          ],
        })
      }
    }
  }
}
