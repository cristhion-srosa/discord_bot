import dotenv from 'dotenv';

import { GatewayIntentBits, Events, Client } from 'discord.js';

dotenv.config();

console.log('Starting Discord bot...');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.BOT_TOKEN);