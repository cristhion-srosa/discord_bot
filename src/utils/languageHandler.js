const fs = require('fs')

const GUILD_LANGS_PATH = './src/data/guildsLanguages.json'

const getGuildsLanguages = (filepath) => {
  try {
    const langs = fs.readFileSync(filepath || GUILD_LANGS_PATH)
    console.log(JSON.parse(langs));
    return JSON.parse(langs)
  } catch (err) {
    console.error(err)
  }
}

const setGuildLanguage = (guildId, language) => {
  const GUILD_OBJECT = {
    guildId: guildId,
    language: language
  }

  const guildsLanguages = getGuildsLanguages() || []
  const guildExists = guildsLanguages.find(guild => guild.guildId === guildId)

  if (guildExists) {
    const index = guildsLanguages.indexOf(guildExists)
    guildsLanguages[index] = GUILD_OBJECT
  } else {
    guildsLanguages.push(GUILD_OBJECT)
  }

  fs.writeFileSync(GUILD_LANGS_PATH, JSON.stringify(guildsLanguages))
}

module.exports = {
  getGuildsLanguages,
  setGuildLanguage
}
