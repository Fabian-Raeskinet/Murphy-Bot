//Models
import { DiscordApp } from '../../app';
import { Event } from '../../models/event';

export default class Error implements Event {
  app: DiscordApp;
  name: string = 'error';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(): Promise<void> {
    console.error;
  }
}
