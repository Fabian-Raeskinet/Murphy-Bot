import { Service } from '../..';

//Models
import { CreateTextChannelDto } from '../../../dtos/text_channel/create_text_channel';

export class CreateTextChannelService extends Service<CreateTextChannelDto, boolean> {
  async execute(params: CreateTextChannelDto): Promise<boolean> {
    try {
      const response = await this.axios.post('/text-channels', params);

      if (response.status === 200) return true;
    } catch (error) {
      console.error('create text channel error post', error);
      return false;
    }
  }
}
