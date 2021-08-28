//Client
import { DiscordApp } from '../app';

//Discord
import { GuildMember, Interaction } from 'discord.js';

//Externals
import * as _ from 'lodash';

//Models
import { Commands } from '../models/commands';

//Config
import * as config from '../config';

export abstract class Command implements Commands {
  aliases: string[];
  allowedUsersCategory: string[];
  app: DiscordApp;
  cooldown: number;
  isAdministratorCommand: boolean;
  name: string;
  necessaryPermissions: string[];

  constructor(client: DiscordApp, allowedUsersCategory: string[], isAdministratorCommand: boolean) {
    this.aliases = [];
    this.allowedUsersCategory = allowedUsersCategory;
    this.app = client;
    this.cooldown = 0;
    this.isAdministratorCommand = isAdministratorCommand;
    this.necessaryPermissions = [];
  }

  abstract execute(params: Interaction): Promise<void>;

  isAllowed(interaction: Interaction): boolean {
    if (this.isAdministratorCommand && interaction.user.id === config.ADMINISTRATOR_ID) return true;

    const member = interaction.member as GuildMember;

    const rolesId = member.roles.cache.map((r) => r.id);
    return _.some(rolesId, (r) => _.includes(this.allowedUsersCategory, r));
  }
}
