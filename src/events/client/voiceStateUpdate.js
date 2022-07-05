const { VoiceState, MessageEmbed } = require("discord.js")
const Event = require("../../structures/Event")

/*
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */

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

    if (oldState.channel === null && newState.channel !== null)
      stateChange.type = "JOIN"
    if (oldState.channel !== null && newState.channel === null)
      stateChange.type = "LEAVE"
    if (oldState.channel !== null && newState.channel !== null)
      stateChange.type = "MOVE"
    if (oldState.channel === null && newState.channel === null) return //pq o discord me odeia
    if (newState.serverMute == true && oldState.serverMute == false)
      return player.pause(true)
    if(newState.serverMute == false && oldState.serverMute == true)
      return player.pause(false)

    if (stateChange.type === "MOVE") {
      if (oldState.channel.id === player.voiceChannel) stateChange.type = "LEAVE"
      if (newState.channel.id === player.voiceChannel) stateChange.type = "JOIN"
    }

    if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
    if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

    if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
    return

    stateChange.members = stateChange.channel.members.filter(
      (member) => !member.user.bot
    )

    switch (stateChange.type) {
      case "JOIN":
        if (stateChange.members.size === 1 && player.paused) {
          let emb = new MessageEmbed()
            .setAuthor({name:'Retomando a fila pausada'})
            .setColor("BLUE")
          await this.client.channels.cache.get(player.textChannel).send({embeds: [emb]});
        player.pause(false);
        }
        break;
      case "LEAVE":
        if (stateChange.members.size === 0 && !player.paused && player.playing) {
          player.pause(true);
  
          let emb = new MessageEmbed()
            .setAuthor({name: `Pausando a fila por que todo mundo saiu!`})
            .setColor("RED")
          await this.client.channels.cache.get(player.textChannel).send({embeds: [emb]});
        }
        break;
    }
  }
}