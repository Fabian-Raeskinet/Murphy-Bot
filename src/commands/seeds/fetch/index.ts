//Client
import { DiscordApp } from '../../../app';

//Discord
import { Interaction, InteractionReplyOptions } from 'discord.js';

//Externals
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

//Models
import { Command } from '../..';
import { CreateGuildDto } from '../../../dtos/guild/create_guild';
import { CreateUserDto } from '../../../dtos/user/create_user';
import { CreateGuildMemberDto } from '../../../dtos/guild_member/create_guild_member';
import { CreateRoleDto } from '../../../dtos/role/create_role';
import { CreateCategoryChannelDto } from '../../../dtos/category_channel/create_category_channel';

//Services
import { CreateGuildService } from '../../../services/guilds/create_guild';
import { CreateUserService } from '../../../services/users/create_user';
import { CreateGuildMemberService } from '../../../services/guild_members/create_guild_member';
import { CreateRoleService } from '../../../services/roles/create_role';
import { CreateCategoryChannelService } from '../../../services/category_channels/create_category_channel';

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
        const members = _.orderBy(Array.from(membersCollection.values()), ['joinedAt'], 'asc');

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

          const createGuildMemberDto: CreateGuildMemberDto = {
            GuildMemberId: uuid(),
            UserId: user.id,
            GuildId: guild.id,
            Nickname: member.nickname,
            JoinedAt: member.joinedAt,
            IsAdmin: member.permissions.has('ADMINISTRATOR'),
            IsAvailable: true,
            IsBanned: false,
            IsKicked: false
          };

          this.saveGuildMember(createGuildMemberDto);
        });

        const rolesCollection = await guild.roles.fetch();
        const roles = _.orderBy(Array.from(rolesCollection.values()), ['position'], 'desc');

        _.each(roles, async (role) => {
          const createRoleDto: CreateRoleDto = {
            RoleId: role.id,
            Name: role.name,
            Color: role.hexColor,
            Position: role.position,
            CreatedAt: role.createdAt,
            MemberRoleCount: role.members.size,
            GuildId: guild.id
          };

          await this.saveRole(createRoleDto);
        });

        const channelsCollection = await guild.channels.fetch();
        const categoryChannels = _.filter(Array.from(channelsCollection.values()), (c) => c.type === 'GUILD_CATEGORY');

        _.each(categoryChannels, (categoryChannel) => {
          const createCategoryChannelDto: CreateCategoryChannelDto = {
            CategoryChannelId: categoryChannel.id,
            Name: categoryChannel.name,
            Position: categoryChannel.position,
            CreatedAt: categoryChannel.createdAt,
            GuildId: guild.id
          };

          this.saveCategoryChannel(createCategoryChannelDto);
        });
      });

      return await interaction.reply({ ephemeral: true, content: 'ok' });
    } catch (error) {
      console.error('fetch error', error);
    }
  }

  async saveGuild(params: CreateGuildDto) {
    try {
      const response = await new CreateGuildService().execute(params);
    } catch (error) {
      console.error(error);
    }
  }

  async saveUser(params: CreateUserDto) {
    try {
      const response = await new CreateUserService().execute(params);
    } catch (error) {
      console.error(error);
    }
  }

  async saveGuildMember(params: CreateGuildMemberDto) {
    try {
      const response = await new CreateGuildMemberService().execute(params);
    } catch (error) {
      console.error(error);
    }
  }

  async saveRole(params: CreateRoleDto) {
    try {
      const response = await new CreateRoleService().execute(params);
    } catch (error) {
      console.error(error);
    }
  }

  async saveCategoryChannel(params: CreateCategoryChannelDto) {
    try {
      const response = await new CreateCategoryChannelService().execute(params);
    } catch (error) {}
  }
}
