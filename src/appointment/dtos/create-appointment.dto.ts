import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsString()
  clientPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  clientAddress: string;

  @IsNotEmpty()
  @IsString()
  startingHour: string;

  @IsNotEmpty()
  @IsNumber()
  dayNumber: number;

  @IsNotEmpty()
  @IsNumber()
  appointmentTypeAgentId: number;

  @IsNotEmpty()
  @IsNumber()
  locationId: number;

  @IsNotEmpty()
  @IsNumber()
  dayId: number;
}
