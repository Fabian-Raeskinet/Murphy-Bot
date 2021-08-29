export interface CreateRoleDto {
  RoleId: string;
  Name: string;
  Color: string;
  CreatedAt: Date;
  Position: number;
  MemberRoleCount: number;
  GuildId: string;
}
