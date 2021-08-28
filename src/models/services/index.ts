import { AxiosInstance } from 'axios';

export interface Services<T, X> {
  axios: AxiosInstance;
  execute(params: T): Promise<X>;
}
