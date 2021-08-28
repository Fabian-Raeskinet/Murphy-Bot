//Client
import { DiscordApp } from '../../../app';

//Discord
import { Interaction, InteractionReplyOptions } from 'discord.js';

//Externals
import * as _ from 'lodash';

//Models
import { Command } from '../..';
import { CreateGuildDto } from '../../../dtos/guild/create_guild';
import { CreateUserDto } from '../../../dtos/user/create_user';

//Services
import { CreateGuild } from '../../../services/guild/create_guild';
import { CreateUser } from '../../../services/user/create_user';

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
      _.each(guilds, async (guild) => {
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
        await this.saveGuild(createGuildDto);

        const membersCollection = await guild.members.fetch();
        const members = Array.from(membersCollection.values());

        _.each(members, async (member) => {
          const user = member.user;

          const createUserDto: CreateUserDto = {
            UserId: user.id,
            UserName: user.username,
            Tag: user.tag,
            Avatar: user.avatar,
            CreatedAt: user.createdAt,
            IsBot: user.bot
          };
          await this.saveUser(createUserDto);
        });
      });

      return await interaction.reply({ ephemeral: true, content: 'ok' });
    } catch (error) {
      console.error('fetch error', error);
    }
  }

  async saveGuild(params: CreateGuildDto) {
    try {
      const response = await new CreateGuild().execute(params);
    } catch (error) {
      console.error(error);
    }
  }

  async saveUser(params: CreateUserDto) {
    try {
      const response = await new CreateUser().execute(params);
    } catch (error) {
      console.error(error);
    }
  }
}
