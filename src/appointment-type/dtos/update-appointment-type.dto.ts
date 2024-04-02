import { IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentTypeDto {
  @IsOptional()
  @IsString()
  typeName: string;

  @IsOptional()
  @IsString()
  duration: string;
}
