import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateAgentDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  addressNro: string;

  @IsNotEmpty()
  @IsString()
  vacationStart: string;

  @IsNotEmpty()
  @IsString()
  vacationEnd: string;

  @IsNotEmpty()
  @IsNumber()
  zoneId: number;
}
