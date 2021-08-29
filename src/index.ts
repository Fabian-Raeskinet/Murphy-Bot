//Application
import { DiscordApp } from './app';

//Config
import * as config from './config';

//Discord
import { ClientOptions, Intents } from 'discord.js';

if (config.TOKEN === undefined) {
  throw new Error('A token must me provided');
}

const clientOptions: ClientOptions = {
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES
  ]
};

const client: DiscordApp = new DiscordApp(config.TOKEN, clientOptions);
