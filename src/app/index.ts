//Config
import * as config from '../config';

//Discord
import { Client, ClientOptions, Intents } from 'discord.js';

//Externals
import axios from 'axios';
import { readdirSync } from 'fs';
import { join } from 'path';

//Models
import { Commands } from '../models/commands';

export class DiscordApp {
  public client: Client;
  public commands: Map<string, Commands<any>>;

  constructor(token: string, clientOptions: ClientOptions) {
    this.client = new Client(clientOptions);
    this.client.login(token);
    this.commands = new Map<string, Commands<any>>();
    this.initialisation();
  }

  private async initialisation() {
    await this.loadEvents();
    await this.loadCommands();
  }

  private async loadEvents(rootDir = join(__dirname, '../events')) {
    console.log('\n-------EVENTS-------');

    for (const dir of readdirSync(rootDir)) {
      const loadClass = await import(`${rootDir}/${dir}`);

      const currentClass = loadClass.default;
      const evt = new currentClass(this);

      this.client.on(evt.name, (...args) => evt.run(...args));

      console.log(`Event loaded: ${evt.name}`);
    }
  }

  private async loadCommands(rootDir = join(__dirname, '../commands')) {
    console.log('\n-------COMMANDS-------');
    for (const dirs of readdirSync(rootDir)) {
      if (!dirs.endsWith('.js')) {
        const commands = readdirSync(`${rootDir}/${dirs}/`);

        for (const file of commands) {
          const loadClass = await import(`${rootDir}/${dirs}/${file}`);
          const currentClass = loadClass.default;
          const command = new currentClass(this);
          this.commands.set(command.name, command);
          console.log(`Command loaded: ${command.name}`);
        }
      }
    }
  }
}
