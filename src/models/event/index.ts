//Client
import { DiscordApp } from '../../app';

export interface Event {
  app: DiscordApp;
  name: string;
  run: (params: any) => Promise<void>;
}
