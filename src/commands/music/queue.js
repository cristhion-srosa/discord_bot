const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const Command = require("../../structures/Command")
const { convertTime } = require("../../utils/convert")
const load = require("lodash")
const { somethingPlaying } = require("../../utils/verify.js")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      description: "Mostra a fila de música do server!",
      options: [
        {
          name: "page",
          type: "NUMBER",
          required: false,
          description: `A página da fila que deseja ver`,
        },
      ],
    })
  }

  run = async (interaction) => {
    const player = this.client.manager.get(interaction.guild.id)

    const isPlaying = await somethingPlaying(player,interaction)
    if(!isPlaying) return

    if (!player.queue.size || player.queue.size === 0) {
      return await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`Agora tocando: ${player.queue.current.title}`)
            .addFields(
              {
                name: `Duração: `,
                value: `${convertTime(player.queue.current.duration)}`,
                inline: true,
              },
              {
                name: "Pedido por: ",
                value: `${player.queue.current.requester}`,
                inline: true,
              }
            )
            .setColor(this.client.embedColor)
            .setTimestamp()
            .setThumbnail(player.queue.current.displayThumbnail("3"))
            .setURL(player.queue.current.uri)
        ],
      }).catch(() => {})
    } else {
      const mapping = player.queue.map(
        (t, i) =>
          `\` ${++i} • [${t.title}](${t.uri}) • \`[ ${convertTime(
            t.duration
          )} ] • [${t.requester}]`
      )

      const chunk = load.chunk(mapping, 10)
      const pages = chunk.map((s) => s.join("\n"))
      let page = interaction.options.getNumber("page")
      if (!page) page = 0
      if (page) page = page - 1
      if (page > pages.length) page = 0
      if (page < 0) page = 0

      if (player.queue.size < 10 || player.queue.totalsize < 10) {
        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`Fila do servidor ${interaction.guild.name}`)
              .setColor(this.client.embedColor)
              .setDescription(`Agora tocando: [${player.queue.current.title}](${player.queue.current.uri}) - [${convertTime(player.queue.current.duration)}]\n\n 
                pedido por ${player.queue.current.requester.tag.toString()}]\n\n**Músicas na fila**\n${pages[page]}`)
              .setFooter({ text: `Page ${page + 1}/${pages.length}` }, interaction.user.displayAvatarURL({ dynamic: true }))
              .setThumbnail(player.queue.current.thumbnail)
              .setTimestamp(),
          ],
        }).catch(() => {})
      } else {
        const but1 = new MessageButton()
          .setCustomId("queue_cmd_but_1_app")
          .setEmoji("⏭️")
          .setStyle("PRIMARY")

        const but2 = new MessageButton()
          .setCustomId("queue_cmd_but_2_app")
          .setEmoji("⏮️")
          .setStyle("PRIMARY")

        const but3 = new MessageButton()
          .setCustomId("queue_cmd_but_3_app")
          .setEmoji("⏹️")
          .setStyle("DANGER")

        const reply = await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`Fila do servidor ${interaction.guild.name}`)
              .setColor(this.client.embedColor)
              .setDescription(`Agora tocando: [${player.queue.current.title}](${player.queue.current.uri}) - [${convertTime(player.queue.current.duration)}]\n\n 
                pedido por ${player.queue.current.requester.tag.toString()}]\n\n**Músicas na fila**\n${pages[page]}`)
              .setFooter({ text: `Page ${page + 1}/${pages.length}` }, interaction.user.displayAvatarURL({ dynamic: true }))
              .setThumbnail(player.queue.current.thumbnail)
              .setTimestamp(),
          ],
          components: [
            new MessageActionRow()
              .addComponents([but2, but3, but1]),
          ],
          fetchReply: true,
        }).catch(() => {})

        const collector = interaction.channel.createMessageComponentCollector({
          time: 60000 * 5,
          idle: 30e3,
        })

        collector.on("collect", async (button) => {
          if (button.customId === "queue_cmd_but_1_app") {
            await button.deferUpdate().catch(() => {})
            page = page + 1 < pages.length ? ++page : 0

            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor(this.client.embedColor)
                  .setDescription(`Agora tocando: [${player.queue.current.title}](${player.queue.current.uri}) - [${convertTime(player.queue.current.duration)}]\n\n 
                    pedido por ${player.queue.current.requester.tag.toString()}]\n\n**Músicas na fila**\n${pages[page]}`)
                  .setFooter({ text: `Page ${page + 1}/${pages.length}` }, interaction.user.displayAvatarURL({ dynamic: true }))
                  .setThumbnail(player.queue.current.thumbnail)
                  .setTimestamp(),
              ],
              components: [
                new MessageActionRow()
                  .addComponents([but2, but3, but1]),
              ],
            }).catch(() => {})
          } else if (button.customId === "queue_cmd_but_2_app") {
            await button.deferUpdate().catch(() => {})
            page = page > 0 ? --page : pages.length - 1

            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor(this.client.embedColor)
                  .setDescription(`Agora tocando: [${player.queue.current.title}](${player.queue.current.uri}) - [${convertTime(player.queue.current.duration)}]\n\n 
                    pedido por ${player.queue.current.requester.tag.toString()}]\n\n**Músicas na fila**\n${pages[page]}`)
                  .setFooter({ text: `Page ${page + 1}/${pages.length}` }, interaction.user.displayAvatarURL({ dynamic: true }))
                  .setThumbnail(player.queue.current.thumbnail)
                  .setTimestamp(),
              ],
              components: [
                new MessageActionRow()
                  .addComponents([but2, but3, but1]),
              ],
            }).catch(() => {})
          } else if (button.customId === "queue_cmd_but_3_app") {
            await button.deferUpdate().catch(() => {})
            await collector.stop()
          } else return
        })

        collector.on("end", async () => {
          reply.delete()
        })
      }
    }
  }
}
