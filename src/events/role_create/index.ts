//Client
import { DiscordApp } from '../../app';

//Discord
import { Role } from 'discord.js';

//Models
import { Event } from '../../models/event';
import { CreateRoleDto } from '../../dtos/role/create_role';

//Services
import { CreateRoleService } from '../../services/roles/create_role';

export default class CreateRole implements Event<void> {
  app: DiscordApp;
  name: string = 'createRole';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(role: Role): Promise<void> {
    await this.saveRole(role);
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
}
