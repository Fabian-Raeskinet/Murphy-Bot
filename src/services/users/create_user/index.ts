import { Service } from '../..';

//Models
import { CreateUserDto } from '../../../dtos/user/create_user';

export class CreateUserService extends Service<CreateUserDto, boolean> {
  async execute(params: CreateUserDto): Promise<boolean> {
    try {
      const response = await this.axios.post('/users', params);

      if (response.status === 200) return true;
    } catch (error) {
      console.error('createUser error post', error);
      return false;
    }
  }
}
