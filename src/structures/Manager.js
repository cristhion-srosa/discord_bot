const { MessageEmbed } = require("discord.js")
const { Manager } = require("erela.js")

const { convertTime } = require("../utils/convert.js")

const apple = require("erela.js-apple")
const deezer = require("erela.js-deezer")
const Spotify = require("better-erela.js-spotify").default

clientID = process.env.SPOTIFY_ID
clientSecret = process.env.SPOTIFY_SECRET

module.exports = (client) => {
  return new Manager({
    autoPlay: true,
    plugins: [
      new Spotify({
        clientID,
        clientSecret,
      }),
      new deezer(),
      new apple(),
    ],
    nodes: [
      {
        identifier: "Node 1",
        host: process.env.LAVALINK_HOST,
        port: parseInt(process.env.LAVALINK_PORT),
        password: process.env.LAVALINK_PASSWORD,
        retryAmount: 30,
        retryDelay: 4000,
        secure: !Boolean(process.env.LAVALINK_SECURE),
      },
    ],
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id)
      if (guild) guild.shard.send(payload)
    },
  })
    .on("nodeConnect", (node) =>
      console.log(`Node "${node.options.identifier}" conectado.`)
    )
    .on("nodeError", (node, error) =>
      console.log(
        `Node "${node.options.identifier}" encontrou um erro: ${error.message}.`
      )
    )
    .on("trackStart", async (player, track) => {
      clearTimeout()
      const channel = client.channels.cache.get(player.textChannel)

      let lastMessage = await channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Agora tocando: ${track.title}`)
            .addFields({
              name: `Duração: `, value: `${convertTime(track.duration)}`, inline: true
            },{
              name: "Pedido por: ", value: `${track.requester}`, inline: true
            })
            .setColor(client.embedColor)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail("3"))
            .setURL(track.uri)
        ],
      })

      setTimeout(() => lastMessage.delete(), 60000)
    })
    .on("queueEnd", (player) => {
      const channel = client.channels.cache.get(player.textChannel)
      channel.send("As músicas acabaram.")
      setTimeout(() => {
        player.destroy()
      }, 10000)
    })
}
