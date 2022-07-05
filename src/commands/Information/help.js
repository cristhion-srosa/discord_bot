//Mostrar comandos disponíveis e o que eles fazem

const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Mostra os comandos do bot!",
    })
  }

  run = (interaction) => {}
}
