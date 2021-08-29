import { Service } from '../..';

//Models
import { CreateCategoryChannelDto } from '../../../dtos/category_channel/create_category_channel';

export class CreateCategoryChannel extends Service<CreateCategoryChannelDto, boolean> {
  async execute(params: CreateCategoryChannelDto): Promise<boolean> {
    try {
      const response = await this.axios.post('/category-channels', params);

      if (response.status === 200) return true;
    } catch (error) {
      console.error('createGuildMember error post', error);
      return false;
    }
  }
}
