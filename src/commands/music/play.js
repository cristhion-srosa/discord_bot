const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

const { toNumber } = require("lodash")

const Command = require("../../structures/Command")

const { convertTime } = require("../../utils/convert.js")

const { connectedChannel } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      description: "Toque uma música!",
      options: [
        {
          name: "música",
          description: "Música que você deseja ouvir",
          type: "STRING",
          required: true,
        },
      ],
    })
  }
  run = async (interaction) => {
    const isConnected = await connectedChannel(interaction)
    if (!isConnected) return

    const search = interaction.options.getString("música")

    const player = this.client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      selfDeafen: true,
    })

    if (player.state === "DISCONNECTED") player.connect()

    let res

    try {
      res = await this.client.manager.search(search, interaction.user)

      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy()
        throw res.exception
      }
    } catch (err) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("Aconteceu um erro ao buscar a música!")
            .setDescription(`Erro: ${err.message}`)
            .setTimestamp(),
        ],
        ephemeral: true,
      })
    }

    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy()
        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTimestamp()
              .setTitle("Nenhum resultado encontrado!"),
          ],
          ephemeral: true,
        })

      case "PLAYLIST_LOADED":
        const playlistSize = Number(player.queue.size) - 1
        player.queue.add(res.tracks)

        if (!player.playing && !player.paused) await player.play()

        const playlistReply = await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(this.client.embedColor)
              .setTimestamp()
              .setTitle("Playlist adicionada à fila")
              .setDescription( `[${res.playlist.name}](${search}) - \`[${convertTime(res.playlist.duration)}]\`` )
          ],
          components: [
            new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("DANGER")
                .setLabel("️X️")
                .setCustomId("REMOVE"),
            ]),
          ],
          fetchReply: true,
        })

        const playlistCollector =
          await playlistReply.createMessageComponentCollector({
            time: 1 * 60000,
          })

        playlistCollector.once("collect", async () => {
          const removeds = Number(player.queue.size - playlistSize) - 1
          for (let i = player.queue.size; i > playlistSize; i--) {
            player.queue.remove(toNumber(i))
          }
          await interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setTitle(`${removeds} músicas removidas!`),
            ],
          })
        })

        playlistCollector.once("end", () => {
          playlistReply.delete()
        })

        break
      case "TRACK_LOADED":
      case "SEARCH_RESULT":
        const track = res.tracks[0]
        const size = Number(player.queue.size) - 1
        player.queue.add(track)

        if (!player.playing && !player.paused && !player.queue.length)
          await player.play()

        const reply = await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(this.client.embedColor)
              .setTimestamp()
              .setThumbnail(track.displayThumbnail("3"))
              .setTitle(`Música adicionada: ${track.title}`)
              .addFields(
                {
                  name: "Duração:",
                  value: `${convertTime(track.duration)}`,
                  inline: true,
                },
                {
                  name: "Pedido por:",
                  value: `${track.requester}`,
                  inline: true,
                }
              )
              .setURL(track.uri)
          ],
          components: [
            new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("DANGER")
                .setLabel("️X️")
                .setCustomId("REMOVE"),
            ]),
          ],
          fetchReply: true,
        })

        const collector = await reply.createMessageComponentCollector({
          time: 1 * 60000,
        })

        collector.once("collect", async () => {
          if (player.queue[0]) {
            const removed = player.queue[toNumber(size + 1)]
            if (size < player.queue.size) {
              player.queue.remove(toNumber(size + 1))
            }
            return await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setDescription({name: `[${removed.title}](${removed.uri}) removida da fila`})
              ],
              components: [],
            })
          } else {
            player.stop()
            return await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setDescription({name: `[${player.queue.current.title}](${player.queue.current.uri})`})
              ],
            })
          }
        })
        collector.once("end", () => {
          reply.delete()
        })
    }
  }
}
