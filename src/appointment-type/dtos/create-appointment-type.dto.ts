import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentTypeDto {
  @IsNotEmpty()
  @IsString()
  typeName: string;

  @IsNotEmpty()
  @IsString()
  duration: string;
}
