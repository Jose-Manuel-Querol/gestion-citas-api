import { IsNotEmpty, IsString } from 'class-validator';

export class RecoverPasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
