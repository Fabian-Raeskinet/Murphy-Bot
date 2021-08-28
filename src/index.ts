//Application
import axios, { AxiosInstance } from 'axios';
import { DiscordApp } from './app';

//Config
import * as config from './config';

if (config.TOKEN === undefined) {
  throw new Error('A token must me provided');
}

const client: DiscordApp = new DiscordApp(config.TOKEN);
