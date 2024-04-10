import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GetAllAppointmentsByAppointmentType {
  @IsNotEmpty()
  @IsString()
  startingDate: string;

  @IsNotEmpty()
  @IsString()
  endingDate: string;

  @IsNotEmpty()
  @IsArray()
  appointmentTypeIds: number[];
}
