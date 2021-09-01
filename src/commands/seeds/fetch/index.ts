//Client
import { DiscordApp } from '../../../app';

//Discord
import {
  CategoryChannel,
  Guild,
  GuildMember,
  Interaction,
  InteractionReplyOptions,
  Role,
  TextChannel,
  User
} from 'discord.js';

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
import { CreateTextChannelDto } from '../../../dtos/text_channel/create_text_channel';
import { CreateTextChannelService } from '../../../services/text_channels/create_text_channel';
import { DeleteDataService } from '../../../services/seeds/delete_data';

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

      await interaction.reply({ ephemeral: true, content: 'ok' });

      await this.deleteData();

      const guildsCollection = await this.app.client.guilds.cache;
      const guilds = Array.from(guildsCollection.values());

      for (const guild of guilds) {
        await this.saveGuild(guild);

        const membersCollection = await guild.members.fetch();
        const members = _.orderBy(Array.from(membersCollection.values()), ['joinedAt'], 'asc');

        for (const member of members) {
          const user = member.user;
          await this.saveUser(user);
          await this.saveGuildMember(member);
        }

        const rolesCollection = await guild.roles.fetch();
        const roles = _.orderBy(Array.from(rolesCollection.values()), ['position'], 'desc');

        for (const role of roles) {
          await this.saveRole(role);
        }

        const channelsCollection = await guild.channels.fetch();
        const categoryChannels = _.filter(Array.from(channelsCollection.values()), (c) => c.type === 'GUILD_CATEGORY');

        for (const categoryChannel of categoryChannels) {
          await this.saveCategoryChannel(categoryChannel as CategoryChannel);
        }

        const textChannels = _.filter(Array.from(channelsCollection.values()), (c) => c.type === 'GUILD_TEXT');

        for (const textChannel of textChannels) {
          await this.saveTextChannel(textChannel as TextChannel);
        }
      }

      return console.log('ok');
    } catch (error) {
      console.error('fetch error', error);
    }
  }

  async deleteData() {
    try {
      const response = await new DeleteDataService().execute(true);
    } catch (error) {}
  }

  async saveGuild(guild: Guild) {
    try {
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
      const response = await new CreateGuildService().execute(createGuildDto);
    } catch (error) {
      console.error(error);
    }
  }

  async saveUser(user: User) {
    try {
      const createUserDto: CreateUserDto = {
        UserId: user.id,
        UserName: user.username,
        Tag: user.tag,
        Avatar: user.avatar,
        CreatedAt: user.createdAt,
        IsBot: user.bot
      };
      const response = await new CreateUserService().execute(createUserDto);
    } catch (error) {
      console.error(error);
    }
  }

  async saveGuildMember(member: GuildMember) {
    try {
      const createGuildMemberDto: CreateGuildMemberDto = {
        GuildMemberId: uuid(),
        UserId: member.user.id,
        GuildId: member.guild.id,
        Nickname: member.nickname,
        JoinedAt: member.joinedAt,
        IsAdmin: member.permissions.has('ADMINISTRATOR'),
        IsAvailable: true,
        IsBanned: false,
        IsKicked: false
      };
      const response = await new CreateGuildMemberService().execute(createGuildMemberDto);
    } catch (error) {
      console.error(error);
    }
  }

  async saveRole(role: Role) {
    try {
      const createRoleDto: CreateRoleDto = {
        RoleId: role.id,
        Name: role.name,
        Color: role.hexColor,
        Position: role.position,
        CreatedAt: role.createdAt,
        MemberRoleCount: role.members.size,
        GuildId: role.guild.id
      };
      const response = await new CreateRoleService().execute(createRoleDto);
    } catch (error) {
      console.error(error);
    }
  }

  async saveCategoryChannel(categoryChannel: CategoryChannel) {
    try {
      const createCategoryChannelDto: CreateCategoryChannelDto = {
        CategoryChannelId: categoryChannel.id,
        Name: categoryChannel.name,
        Position: categoryChannel.position,
        CreatedAt: categoryChannel.createdAt,
        GuildId: categoryChannel.guild.id
      };
      const response = await new CreateCategoryChannelService().execute(createCategoryChannelDto);
    } catch (error) {
      console.error(error);
    }
  }

  async saveTextChannel(textChannel: TextChannel) {
    try {
      const createTextChannelDto: CreateTextChannelDto = {
        TextChannelId: textChannel.id,
        Name: textChannel.name,
        Position: textChannel.position,
        CreatedAt: textChannel.createdAt,
        IsNsfw: textChannel.nsfw,
        CategoryChannelId: textChannel.parentId,
        GuildId: textChannel.guild.id
      };
      const response = await new CreateTextChannelService().execute(createTextChannelDto);
    } catch (error) {
      console.error(error);
    }
  }
}
