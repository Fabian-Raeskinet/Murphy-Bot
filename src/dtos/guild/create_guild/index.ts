export interface CreateGuildDto {
  GuildId: string;
  Name: string;
  Icon: string;
  Banner: string;
  Description: string;
  OwnerId: string;
  CreatedAt: Date;
  IsAvailable: boolean;
  AfkChannelId: string;
  MemberCount: number;
}
