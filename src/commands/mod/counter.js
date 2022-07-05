const {
  MessageActionRow,
  MessageButton,
  AutocompleteInteraction,
} = require("discord.js")
const Command = require("../../structures/Command")

const actionRow = new MessageActionRow().addComponents([
  new MessageButton().setStyle("DANGER").setLabel("-1").setCustomId("REMOVE"),

  new MessageButton().setStyle("SUCCESS").setLabel("+1").setCustomId("ADD"),

  new MessageButton()
    .setStyle("PRIMARY")
    .setLabel("ZERAR")
    .setCustomId("RESET"),
])

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "counter",
      description: "Inicia um contador no canal",
      options: [
        {
          name: "privado",
          type: "BOOLEAN",
          description: "O contador deve ser privado",
          required: true,
          //AutocompleteInteraction: true
        },
      ],
    })
  }

  run = async (interaction) => {
    let count = 0

    const reply = await interaction.reply({
      content: `Valor: \`${count}\``,
      components: [actionRow],
      fetchReply: true,
    })

    const filter = function (b) {
      const boolean = interaction.options.getBoolean("privado")

      if (!boolean || b.user.id === interaction.user.id) return true

      return false
    }

    const collector = reply.createMessageComponentCollector({
      filter,
      time: 10 * 60000,
    })

    collector.on("collect", (i) => {
      switch (i.customId) {
        case "REMOVE":
          count--
          break

        case "ADD":
          count++
          break

        case "RESET":
          count = 0
          break
      }
      i.update({
        content: `Valor: \`${count}\``,
      })
    })

    collector.on("end", (collected, reason) => {
      if (reason === "time")
        interaction.editReply({
          content: `Contador finalizado em: \`${count}\``,
          components: [],
        })
    })
  }
}
