const Event = require("../../structures/Event")

module.exports = class extends Event {
  constructor(client) {
    super (client, {
      name: "ready",
    })
  }

  run = () => {
    console.log(`Bot ${this.client.user.username} logado com sucesso em ${this.client.guilds.cache.size} servidores`)
    this.client.user.setActivity('/play');
    this.client.regCommands()

    this.client.manager.init(this.client.user.id)
  }
}