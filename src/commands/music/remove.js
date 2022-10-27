const {EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType} = require("discord.js")
const Command = require("../../structures/Command")
const { connected, playing} = require("../../utils/verify.js")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Command {
  constructor(client){
    super(client,{
      name: "remove",
      description: "Remove a música na fila",
      options: [
        {
          name: "number",
          description: "Número da música na fila",
          required: true,
          type: ApplicationCommandOptionType.Integer,
        }
      ],
      type: ApplicationCommandType.ChatInput
    })
  }

  run = async (interaction) => {
    const isConnected = await connected(interaction)
    if(!isConnected) return

    const player = this.client.manager.get(interaction.guild.id)
    const isPlaying = await playing(player,interaction)
    if(!isPlaying) return

    let args = interaction.options.getNumber("number")
    args = (Number(args) - 1)
    if (args > player.queue.size){
      return await interaction.reply({
        embeds:[
          new EmbedBuilder()
          .setColor(this.client.errorColor)
          .setTitle(`Nenhuma música encontrada na posição ${args - 1}! | Quantidade de músicas na fila: ${player.queue.length}`)
        ],
        ephemeral: true,
      })
    }

    const song = player.queue[args]
    player.queue.remove(song)

    let message = await interaction.reply({
      embeds:[
        new EmbedBuilder()
        .setColor(this.client.embedColor)
        .setTitle(`${song.title} removida!`)
        .setURL(song.uri)
        .setTimestamp()
      ],
      fetchReply: true
    })
    deleteMessage(message, 30000)
    return
  }
}