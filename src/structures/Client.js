const { Client } = require("discord.js")
const { readdirSync } = require("fs")
const { join } = require("path")
const { I18n } = require('i18n')
const path = require("path")

const erelaManager = require("./Manager")

module.exports = class extends Client {
  constructor(options) {
    super(options)

    this.commands = []
    this.loadCommands()
    this.loadEvents()

    this.i18n = this.startI18n()
    this.manager = erelaManager(this)
    this.errorColor = process.env.ERROR_COLOR
    this.embedColor = process.env.COLOR
  }

  startI18n() {
    const i18n = new I18n({
      locales: ['en', 'es', 'pt-BR'],
      directory: path.join(__dirname, '/locales'),
      defaultLocale: 'pt-BR',
    })

    i18n.setLocale('pt-BR')

    return i18n
  }

  regCommands() {
    this.application.commands
      .set(this.commands)
      .then(() => console.log(this.i18n.__('commands_loaded')))
  }

  loadCommands(path = "src/commands"){
    const categories = readdirSync(path)

    for (const category of categories) {
      const commands = readdirSync(`${path}/${category}`)

      for (const command of commands) {
        const commandClass = require(join(process.cwd(),`${path}/${category}/${command}`))
        const cmd = new commandClass(this)
        this.commands.push(cmd)
      }
    }
  }

  loadEvents(path = "src/events") {
    const categories = readdirSync(path)

    for (const category of categories){
      const events = readdirSync(`${path}/${category}`)

      for (const event of events) {
        const eventClass = require(join(process.cwd(),`${path}/${category}/${event}`))
        const evt = new eventClass(this)

        this.on(evt.name, evt.run)
      }
    }
  }
}