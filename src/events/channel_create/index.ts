//Client
import { DiscordApp } from '../../app';

//Discord
import { CategoryChannel, GuildChannel, TextChannel } from 'discord.js';

//Models
import { Event } from '../../models/event';
import { CreateCategoryChannelDto } from '../../dtos/category_channel/create_category_channel';
import { CreateTextChannelDto } from '../../dtos/text_channel/create_text_channel';

//Services
import { CreateCategoryChannelService } from '../../services/category_channels/create_category_channel';
import { CreateTextChannelService } from '../../services/text_channels/create_text_channel';

export default class ChannelCreate implements Event<void> {
  app: DiscordApp;
  name: string = 'channelCreate';

  constructor(app: DiscordApp) {
    this.app = app;
  }

  public async run(channel: GuildChannel): Promise<void> {
    switch (channel.type) {
      case 'GUILD_CATEGORY':
        await this.saveCategoryChannel(channel as CategoryChannel);
        break;
      case 'GUILD_TEXT':
        await this.saveTextChannel(channel as TextChannel);
        break;
      default:
        break;
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
