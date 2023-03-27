const { EmbedBuilder } = require("discord.js")
const Event = require("../../structures/Event")
const { deleteMessage } = require("../../utils/timeout")

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "voiceStateUpdate",
    })
  }

  run = async (oldState, newState) => {
    let guildId = newState.guild.id
    const player = this.client.manager.get(guildId)

    if(!player || player.state !== "CONNECTED") return

    const stateChange = {}

    if (oldState.channel === null && newState.channel !== null) stateChange.type = "JOIN"
    if (oldState.channel !== null && newState.channel === null) stateChange.type = "LEAVE"
    if (oldState.channel !== null && newState.channel !== null) stateChange.type = "MOVE"
    if (newState.serverMute && !oldState.serverMute) return player.pause(true)
    if (!newState.serverMute  && oldState.serverMute) return player.pause(false)

    if (stateChange.type === "MOVE") {
      if (oldState.channel.id === player.voiceChannel){
        stateChange.type = "LEAVE"
        stateChange.channel = oldState.channel
      } 
      else if (newState.channel.id === player.voiceChannel) {
        stateChange.type = "JOIN"
        stateChange.channel = newState.channel
      }
    }

    if(!stateChange.channel || stateChange.channel.id !== player.voiceChannel) return

    stateChange.members = stateChange.channel.members.filter((member) => !member.user.bot)

    
    if (stateChange.type === "JOIN") {
      if (stateChange.members.size === 1 && player.paused) {
        clearTimeout()
        player.pause(false)
          let message = await this.client.channels.cache.get(player.textChannel).send({
            embeds: [
              new EmbedBuilder()
                .setTitle("retomando a fila pausada")
                .setColor(this.client.embedColor)
            ]
          })
          deleteMessage(message, 60000)
      }
    } else {
      if (stateChange.members.size === 0 && !player.paused && player.playing) {
          player.pause(true)
          let message = await this.client.channels.cache.get(player.textChannel).send({
            embeds: [
              new EmbedBuilder()
                .setTitle(`Pausando a fila por que todo mundo saiu!`)
                .setColor(this.client.errorColor)
            ]
          })
          deleteMessage(message, 5 * 60000)
          setTimeout(async () => {
            let newMessage = await this.client.channels.cache.get(player.textChannel).send({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`saindo da chamada por que fiquei sozinho por 5 minutos`)
                  .setColor(this.client.errorColor)
              ]
            })
            player.destroy()
            deleteMessage(newMessage, 60000)
          }, 5 * 60000);
        }
    }
  }
}