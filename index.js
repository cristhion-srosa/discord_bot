require("dotenv").config();
const { GatewayIntentBits, Partials, Options } = require('discord.js');

 const { Kwanza } = require("./src/structures/Kwanza.js");
const Manager = require("./src/structures/Manager.js");

const { Guilds, GuildMembers, GuildVoiceStates } = GatewayIntentBits;

const options = {
  clientOptions: {
    allowedMentions: {
      parse: ['users', 'roles'],
      repliedUser: true
    },
    partials: [Partials.User, Partials.Message, Partials.Reaction, Partials.GuildMember],
    intents: [Guilds, GuildMembers, GuildVoiceStates],
    makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
  },
  client: Kwanza,
  autoRestart: true,
  autoReconnect: true,
  spawnTimeout: 60000,
  token: process.env.BOT_TOKEN,
};

const manager = new Manager(options);

manager.start();

