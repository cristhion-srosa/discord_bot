const { MessageEmbed } = require('discord.js');
const { Manager } = require('erela.js');

const Spotify  = require("better-erela.js-spotify").default;

clientID = process.env.SPOTIFY_ID
clientSecret = process.env.SPOTIFY_SECRET

module.exports = (client) => {
  return new Manager({
    autoPlay: true,
    plugins: [
      new Spotify({
        clientID,
        clientSecret
      })
    ],
    nodes: [
      {
        identifier: 'Node 1',
        host: process.env.LAVALINK_HOST,
        port: parseInt(process.env.LAVALINK_PORT),
        password: process.env.LAVALINK_PASSWORD,
        retryAmount: 30,
        retryDelay: 3000,
        secure: !Boolean(process.env.LAVALINK_SECURE)
      }
    ],
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  })
    .on("nodeConnect", node => console.log(`Node "${node.options.identifier}" conectado.`))
    .on("nodeError", (node, error) => console.log(
      `Node "${node.options.identifier}" encontrou um erro: ${error.message}.`
    ))
    .on("trackStart", (player, track) => {
      const channel = client.channels.cache.get(player.textChannel);
      channel.send({ embeds: [new MessageEmbed().setColor(client.embedColor).setTimestamp().setThumbnail(track.displayThumbnail('3')).setDescription(`Agora tocando: [${track.title}](${track.uri}) \n\n pedido por ${track.requester.tag.toString()}.`)]})
      //channel.send(`Agora tocando: \`${track.title}\`, pedido por \`${track.requester.tag.toString()}\`.`);
    })
    .on("queueEnd", player => {
      const channel = client.channels.cache.get(player.textChannel);
      channel.send("As músicas acabaram.");
      player.destroy();
    });
}