export interface CreateUserDto {
  UserId: string;
  UserName: string;
  Tag: string;
  Avatar: string;
  CreatedAt: Date;
  IsBot: boolean;
}
