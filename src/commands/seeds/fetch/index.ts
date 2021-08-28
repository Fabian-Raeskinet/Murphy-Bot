//Client
import { DiscordApp } from '../../../app';

//Discord
import { Interaction, InteractionReplyOptions } from 'discord.js';

//Externals
import * as _ from 'lodash';

//Models
import { Command } from '../..';
import { CreateGuildDto } from '../../../dtos/guild/create_guild';
import { CreateGuild } from '../../../services/guild/create_guild';

export default class Fetch extends Command<void> {
  name: string = 'fetch';

  constructor(app: DiscordApp, allowedUsersCategory) {
    super(app, allowedUsersCategory, true);
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

      const guildsCollection = await this.app.client.guilds.cache;
      const guilds = Array.from(guildsCollection.values());
      const guild = guilds[0];

      const createGuildDto: CreateGuildDto = {
        GuildId: guild.id,
        Name: guild.name,
        Icon: guild.icon,
        Banner: guild.banner,
        Description: guild.description,
        OwnerId: guild.ownerId,
        CreatedAt: guild.createdAt,
        IsAvailable: true,
        AfkChannelId: guild.afkChannelId,
        MemberCount: guild.memberCount
      };

      console.log(createGuildDto);

      try {
        const service = new CreateGuild();
        const response = await service.execute(createGuildDto);
      } catch (error) {
        console.error(error);
      }
      return await interaction.reply({ ephemeral: true, content: 'ok' });
    } catch (error) {
      console.error('fetch error', error);
    }
  }
}
