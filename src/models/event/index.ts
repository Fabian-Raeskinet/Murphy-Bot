//Client
import { DiscordApp } from '../../app';

export interface Event<T> {
  app: DiscordApp;
  name: string;
  run: (params: any) => Promise<T>;
}
