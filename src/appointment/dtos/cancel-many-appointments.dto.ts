import { IsArray, IsNotEmpty } from 'class-validator';

export class CancelManyAppointments {
  @IsNotEmpty()
  @IsArray()
  appointmentIds: number[];
}
