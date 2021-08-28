//Client
import { DiscordApp } from '../../../app';

//Discord
import { Interaction, InteractionReplyOptions } from 'discord.js';

//Externals
import * as _ from 'lodash';

//Models
import { Command } from '../..';

export default class Ping extends Command {
  name: string = 'ping';

  constructor(client: DiscordApp, allowedUsersCategory) {
    super(client, allowedUsersCategory, false);
    this.aliases = [];
  }

  public async execute(interaction: Interaction): Promise<void> {
    try {
      if (!interaction.isCommand()) return;

      if (interaction.commandName !== this.name && !interaction.inGuild()) return;

      const isAllowed = this.isAllowed(interaction);

      if (!isAllowed) {
        const response: InteractionReplyOptions = {
          content: "Vous n'avez pas le rôle nécéssaire pour cette action",
          ephemeral: true
        };
        return await interaction.reply(response);
      }

      return await interaction.reply('Pong!');
    } catch (error) {
      console.error('ping error', error);
    }
  }
}
