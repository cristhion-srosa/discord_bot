const { EmbedBuilder } = require("discord.js")
const { Manager } = require("erela.js")

const { convertTime } = require("../utils/convert.js")
const { deleteMessage, exitCall  } = require("../utils/timeout")

const apple = require("erela.js-apple")
const deezer = require("erela.js-deezer")
const Spotify = require("better-erela.js-spotify").default

require("../utils/lavafilter")

const clientId = process.env.SPOTIFY_ID
const clientSecret = process.env.SPOTIFY_SECRET

module.exports = (client) => {
  return new Manager({
    autoPlay: true,
    plugins: [
      new Spotify({clientId,clientSecret}),
      new deezer(),
      new apple(),
    ],
    nodes: [
      {
        identifier: "Node 1",
        host: process.env.LAVALINK_HOST,
        port: parseInt(process.env.LAVALINK_PORT),
        password: process.env.LAVALINK_PASSWORD,
        secure: false,
      },
    ],
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id)
      if (guild) guild.shard.send(payload)
    },
  })
    .on("nodeConnect", (node) => {
      console.log(`Node "${node.options.identifier}" conectado.`)
    })
    .on("nodeDisconnect", (node, reason) => {
      console.log(`Node ${node.options.identifier} foi desconectado por conta de um erro: ${JSON.stringify(reason)}`)
    })
    .on("nodeError", (node, error) => {
      console.log(`Node "${node.options.identifier}" encontrou um erro: ${error.message}.`)
    })
    .on("trackStart", async (player, track) => {
      const channel = client.channels.cache.get(player.textChannel)
      
      let playingMessage = await channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Agora tocando: ${track.title}`)
            .addFields(
              {name: `Duração: `, value: `${convertTime(track.duration)}`, inline: true},
              {name: "Pedido por: ", value: `${track.requester}`, inline: true}
            )
            .setColor(client.embedColor)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail("3"))
            .setURL(track.uri)
        ], 
      })
      deleteMessage(playingMessage, 60000)
    })
    .on("trackStuck", (player) => {
      console.log("Música bugou")
      player.stop()
    })
    .on("trackError", (player, payload) => {
      console.log("Erro na música!")
      console.log(`${payload.error}`)
      player.stop()
    })
    .on("queueEnd", async (player) => {
      const channel = client.channels.cache.get(player.textChannel)
      let endMessage = await channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.errorColor)
            .setTitle("As músicas acabaram!")
            .setTimestamp()
        ], 
      })
      deleteMessage(endMessage, 60000)
      exitCall(player, 20000)
    })
}
