//Client
import { DiscordApp } from '../../app';

//Discord
import { GuildBan } from 'discord.js';

//Models
import { Event } from '../../models/event';

export default class GuildBanAdd implements Event {
  app: DiscordApp;
  name: string = 'guildBanAdd';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(guildBan: GuildBan): Promise<void> {}
}
