import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Debe ingresar un correo válido' })
  email: string;
}
