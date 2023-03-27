const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const Command = require("../../structures/Command")
const { connected, somethingPlaying } = require("../../utils/verify")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "loop",
      description: "Altera o estado de repetição da música/fila",
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: "input",
          description: "O que deseja colocar em repetição (música ou fila)",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            {
              name: "Música",
              value: "track"
            },
            {
              name: "Fila",
              value: "queue"
            }
          ]
        }
      ]
    })
  }

  run = async (interaction) => {
    const isConnected = await connected(interaction)
    if (!isConnected) return
    
    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await somethingPlaying(player, interaction)
    if(!isPlaying) return

    const input = interaction.options.getString("Input")

    if (input === "track") {
      if (player.trackRepeat) {
        player.setTrackRepeat(false)
        let message = await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.client.errorColor)
              .setTitle("A música não vai mais repetir!")
          ],
          fetchReply: true
        })
        deleteMessage(message, 60000)
        return
      } else {
        player.setTrackRepeat(true)
        let message = await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.client.embedColor)
              .setTitle("A música irá repetir!")
          ],
          fetchReply: true
        })
        deleteMessage(message, 60000)
      }
    } else if (input === "queue") {
        if (!player.queue.size) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(this.client.errorColor)
                .setTitle("A fila está vazia!")
            ],
            ephemeral: true
          })
        }

        if (player.queueRepeat) {
          player.setQueueRepeat(false)
          let message = await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(this.client.errorColor)
                .setTitle("A fila não vai mais repetir!")
            ],
            fetchReply: true
          })
          deleteMessage(message, 60000)
          return
        } else {
          player.setQueueRepeat(true)
          let message = await interaction.reply({
            emebds: [
              new EmbedBuilder()
                .setColor(this.client.embedColor)
                .setTitle("A fila irá repetir!")
            ],
            fetchReply: true
          })
          deleteMessage(message, 60000)
          return
        }
    }
  }
}