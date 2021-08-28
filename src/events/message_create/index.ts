//Client
import { DiscordApp } from '../../app';

//Discord
import { Message } from 'discord.js';

//Models
import { Event } from '../../models/event';

export default class MessageCreate implements Event<void> {
  app: DiscordApp;
  name: string = 'messageCreate';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(message: Message): Promise<void> {
    try {
    } catch (error) {
      console.error('handle message error', error);
    }
  }
}
