//Config
import axios, { AxiosInstance } from 'axios';
import * as config from '../config';

export abstract class Service<T, X> {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({ baseURL: config.AXIOS_BASE_URL });
  }

  abstract execute(params: T): Promise<X>;
}
