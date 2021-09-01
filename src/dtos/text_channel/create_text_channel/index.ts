export interface CreateTextChannelDto {
  TextChannelId: string;
  Name: string;
  Position: number;
  IsNsfw: boolean;
  CreatedAt: Date;
  CategoryChannelId: string;
  GuildId: string;
}
