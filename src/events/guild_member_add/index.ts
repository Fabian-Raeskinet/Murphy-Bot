//Client
import { DiscordApp } from '../../app';

//Discord
import { GuildMember, User } from 'discord.js';

//Externals
import { v4 as uuid } from 'uuid';

//Models
import { Event } from '../../models/event';
import { CreateGuildMemberDto } from '../../dtos/guild_member/create_guild_member';
import { CreateUserDto } from '../../dtos/user/create_user';

//Services
import { CreateUserService } from '../../services/users/create_user';
import { CreateGuildMemberService } from '../../services/guild_members/create_guild_member';

export default class GuildMemberAdd implements Event<void> {
  app: DiscordApp;
  name: string = 'guildMemberAdd';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(member: GuildMember): Promise<void> {
    const user = member.user;
    await this.saveUser(user);
    await this.saveGuildMember(member);
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
}
