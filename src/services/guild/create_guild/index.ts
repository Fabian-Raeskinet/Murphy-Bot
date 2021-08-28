import axios, { AxiosResponse } from 'axios';
import { Service } from '../..';
import { CreateGuildDto } from '../../../dtos/guild/create_guild';

export class CreateGuild extends Service<CreateGuildDto, boolean> {
  async execute(params: CreateGuildDto): Promise<boolean> {
    try {
      const response = await this.axios.post('/guilds', params);

      if (response.status === 200) return true;
    } catch (error) {
      console.error('createGuild error post', error);
      return false;
    }
  }
}
