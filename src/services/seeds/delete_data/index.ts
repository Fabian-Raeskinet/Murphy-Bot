import { Service } from '../..';

export class DeleteDataService extends Service<any, boolean> {
  async execute(params: any): Promise<boolean> {
    try {
      const response = await this.axios.delete('/delete');

      if (response.status === 200) return true;
    } catch (error) {
      console.error('createUser error post', error);
      return false;
    }
  }
}
