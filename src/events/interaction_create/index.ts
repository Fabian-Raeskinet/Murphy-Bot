//Client
import { DiscordApp } from '../../app';

//Discord
import { Interaction } from 'discord.js';

//Models
import { Event } from '../../models/event';
import { Commands } from '../../models/commands';

export default class InteractionCreate implements Event<void> {
  app: DiscordApp;
  name: string = 'interactionCreate';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(interaction: Interaction): Promise<void> {
    try {
      if (!interaction.isCommand()) return;
      const command: Commands<any> = this.app.commands.get(interaction.commandName);

      if (!command) return;

      command.execute(interaction);
    } catch (error) {
      console.error('handle interaction error', error);
    }
  }
}
