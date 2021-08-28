//Client
import { DiscordApp } from '../../app';

//Discord
import { ApplicationCommandData, Client } from 'discord.js';

//Models
import { Event } from '../../models/event';

export default class Ready implements Event {
  app: DiscordApp;
  name: string = 'ready';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(client: Client): Promise<void> {
    try {
      console.log('-------READY-------');

      console.log('Bot ready !');

      const commands: ApplicationCommandData[] = [
        {
          name: 'fetch',
          description: 'fetch data'
        }
      ];

      await client.application.commands.set(commands, '615588332126208093');
    } catch (error) {
      console.error('handle ready error', error);
    }
  }
}
