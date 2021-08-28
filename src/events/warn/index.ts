//Client
import { DiscordApp } from '../../app';

//Models
import { Event } from '../../models/event';

export default class Warn implements Event<void> {
  app: DiscordApp;
  name: string = 'warn';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(): Promise<void> {
    console.warn;
  }
}
