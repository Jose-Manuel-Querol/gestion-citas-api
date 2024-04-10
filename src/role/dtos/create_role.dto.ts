import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
