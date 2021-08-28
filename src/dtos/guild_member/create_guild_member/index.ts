export interface CreateGuildMemberDto {
  GuildMemberId: string;
  UserId: string;
  GuildId: string;
  Nickname: string;
  JoinedAt: Date;
  IsAdmin: boolean;
  IsAvailable: boolean;
  IsBanned: boolean;
  IsKicked: boolean;
}
