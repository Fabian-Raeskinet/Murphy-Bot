import { Service } from '../..';

//Models
import { CreateRoleDto } from '../../../dtos/role/create_role';

export class CreateRole extends Service<CreateRoleDto, boolean> {
  async execute(params: CreateRoleDto): Promise<boolean> {
    try {
      const response = await this.axios.post('/roles', params);

      if (response.status === 200) return true;
    } catch (error) {
      console.error('createRole error post', error);
      return false;
    }
  }
}
