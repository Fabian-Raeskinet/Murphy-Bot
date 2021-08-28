//Client
import { DiscordApp } from '../../app';

//Discord
import { Interaction } from 'discord.js';

export interface Commands<T> {
  allowedUsersCategory: string[];
  app: DiscordApp;
  cooldown?: number;
  name: string;
  necessaryPermissions: string[];
  isAdministratorCommand: boolean;
  execute: (params: Interaction) => Promise<T>;
  isAllowed: (interaction: Interaction) => boolean;
}
