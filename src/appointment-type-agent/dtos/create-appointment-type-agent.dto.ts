import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateDayDto } from '../../day/dtos/create-day.dto';
export class CreateAppointmentTypeAgent {
  @IsNotEmpty()
  @IsNumber()
  appointmentTypeId: number;

  days: CreateDayDto[];
}
