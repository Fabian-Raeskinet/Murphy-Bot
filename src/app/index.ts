//Config
import * as config from '../config';

//Discord
import { Client, Intents } from 'discord.js';

//Externals
import axios from 'axios';
import { readdirSync } from 'fs';
import { join } from 'path';

//Models
import { Commands } from '../models/commands';

export class DiscordApp {
  public axios;
  public client: Client;
  public commands: Map<string, Commands<any>>;

  constructor(token: string) {
    this.axios = axios.create({ baseURL: config.AXIOS_BASE_URL });
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES
      ]
    });
    this.client.login(token);
    this.commands = new Map<string, Commands<any>>();
    this.loadEvents();
    this.loadCommands();
  }

  private async loadEvents(rootDir = join(__dirname, '../events')) {
    console.log('-------EVENTS-------');

    readdirSync(rootDir).forEach(async (dir) => {
      const loadClass = await import(`${rootDir}/${dir}`);

      const currentClass = loadClass.default;
      const evt = new currentClass(this);

      this.client.on(evt.name, (...args) => evt.run(...args));

      console.log(`Event loaded: ${evt.name}`);
    });
  }

  private async loadCommands(rootDir = join(__dirname, '../commands')) {
    console.log('-------COMMANDS-------');
    readdirSync(rootDir).forEach(async (dirs) => {
      if (!dirs.endsWith('.js')) {
        const commands = readdirSync(`${rootDir}/${dirs}/`);
        console.log('command', commands);

        for (const file of commands) {
          const loadClass = await import(`${rootDir}/${dirs}/${file}`);
          const currentClass = loadClass.default;
          const command = new currentClass(this);
          this.commands.set(command.name, command);
          console.log(`Command loaded: ${command.name}`);
        }
      }
    });
  }
}
