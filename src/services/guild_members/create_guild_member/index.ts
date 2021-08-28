import { Service } from '../..';

//Models
import { CreateGuildMemberDto } from '../../../dtos/guild_member/create_guild_member';

export class CreateGuildMember extends Service<CreateGuildMemberDto, boolean> {
  async execute(params: CreateGuildMemberDto): Promise<boolean> {
    try {
      const response = await this.axios.post('/guild-members', params);

      if (response.status === 200) return true;
    } catch (error) {
      console.error('createGuild error post', error);
      return false;
    }
  }
}
