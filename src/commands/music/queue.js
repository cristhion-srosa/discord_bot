const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType} = require("discord.js")
const Command = require ("../../structures/Command")
const { convertTime } = require("../../utils/convert")
const load = require("lodash")
const { playing } = require("../../utils/verify")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      description: "Mostra a fila de músicas do server!",
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: "page",
          description: 'A página da fila que deseja ver',
          type: ApplicationCommandOptionType.Integer,
          required: false
        }
      ]
    })
  }

  run = async (interaction) => {
    const player = this.client.manager.get(interaction.guild.id)
    
    const isPlaying = await playing(player, interaction)
    if (!isPlaying) return

    if ( player.queue.size === 0){
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Agora tocando: ${player.queue.current.title}`)
            .addFields(
              {
                name: `Duração: `,
                value: `${convertTime(player.queue.current.duration)}`,
                inline: true,
              },
              {
                name: "Pedido por: ",
                value: `${convertTime(player.queue.current.duration)}`,
                inline: true,
              }
            )
            .setColor(this.client.embedColor)
            .setTimestamp()
            .setThumbnail(player.queue.current.displayThumbnail("3"))
            .setURL(player.queue.current.uri)
        ]
      }).catch(() => {})
    } else {
      const mapping = player.queue.map((t, i) => ` **${++i}:**  **[${t.title}](${t.uri})** | [ ${convertTime( t.duration)}]\n`)

      const chunk = load.chunk(mapping, 10)
      const pages = chunk.map((s) => s.join("\n"))
      let page = interaction.options.getNumber("page")
      if (!page) page = 0
      if (page) page = page - 1
      if (page > pages.length) page = 0
      if (page < 0) page = 0

      if (player.queue.size < 10 || player.queue.totalsize < 10) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Fila do servidor ${interaction.guild.name}`)
              .setColor(this.client.embedColor)
              .setDescription(`Agora tocando: [${player.queue.current.title}](${player.queue.current.uri}) - [${convertTime(player.queue.current.duration)}]\n\n
                pedido por ${player.queue.current.requester}\n\n**Músicas na fila**\n${pages[page]}`)
              .setFooter({ text: `page ${page + 1}/${pages.length}`}, interaction.user.displayAvatarURL({ dynamic: true}))
              .setThumbnail(player.queue.current.thumbnail)
              .setTimestamp()
          ]
        }).catch(() => {})
      } else {
        const but1 = new ButtonBuilder()
          .setCustomId("queue_1")
          .setEmoji("⏭️")
          .setStyle("Primary")

        const but2 = new ButtonBuilder()
          .setCustomId("queue_2")
          .setEmoji("⏮️")
          .setStyle("Primary")

        const but3 = new ButtonBuilder()
          .setCustomId("queue_3")
          .setEmoji("⏹️")
          .setStyle("Danger")

        const reply = await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Fila do servidor ${interaction.guild.name}`)
              .setColor(this.client.embedColor)
              .setDescription(`Agora tocando: [${player.queue.current.title}](${player.queue.current.uri}) - [${convertTime(player.queue.current.duration)}]\n 
                Pedido por: ${player.queue.current.requester}\n\nDuração da playlist: **${convertTime(player.queue.duration)}**\n\n**Músicas na fila**\n${pages[page]}`)
              .setFooter({ text: `Page ${page + 1}/${pages.length}`}, interaction.user.displayAvatarURL({ dynamic: true }))
              .setThumbnail(player.queue.current.thumbnail)
              .setTimestamp()
          ],
          components: [
            new ActionRowBuilder()
              .addComponents([but2, but3, but1])
          ],
          fetchReply: true,
        }).catch(() => {})

        const collector = interaction.channel.createMessageComponentCollector({time: 5 * 60000, idle: 30e3})

        collector.on("collect", async (button) => {
          if (button.customId === "queue_1"){
            await button.deferUpdate().catch(() => {})
            page = page + 1 < pages.length ? ++ page : 0

            return interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor(this.client.embedColor)
                  .setDescription(`Agora tocando: [${player.queue.current.title}](${player.queue.current.uri}) - [${convertTime(player.queue.current.duration)}]\n\n 
                    pedido por ${player.queue.current.requester}\n\n**Músicas na fila**\n${pages[page]}`)
                  .setFooter({ text: `Page ${page + 1}/${pages.length}`})
                  .setThumbnail(player.queue.current.thumbnail)
                  .setTimestamp()
              ],
              components: [
                new ActionRowBuilder()
                  .addComponents([but2, but3, but1])
              ]
            }).catch(() => {})
          } else if (button.customId === "queue_2") {
            await button.deferUpdate().catch(() => {})
            page = page > 0 ? --page : pages.length - 1

            return interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor(this.client.embedColor)
                  .setDescription(`Agora tocando: [${player.queue.current.title}](${player.queue.current.uri}) - [${convertTime(player.queue.current.duration)}]\n\n 
                    pedido por ${player.queue.current.requester}\n\n**Músicas na fila**\n${pages[page]}`)
                  .setFooter({ text: `Page ${page + 1}/${pages.length}`}, interaction.user.displayAvatarURL({ dynamic: true}))
                  .setThumbnail(player.queue.current.thumbnail)
                  .setTimestamp()
              ],
              components: [
                new ActionRowBuilder()
                  .addComponents([but2, but3, but1])
              ]
            }).catch(() => {})
          } else {
            await button.deferUpdate().catch(() => {})
            await collector.stop()
          }
        })

        collector.once("end", async () => {
          reply.delete().catch(() => {})
        })
      }
    }
  }
}