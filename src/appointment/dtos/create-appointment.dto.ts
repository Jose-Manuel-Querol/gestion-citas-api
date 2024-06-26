import { IsISO8601, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsString()
  clientLastName: string;

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
  @IsString()
  endingHour: string;

  @IsNotEmpty()
  @IsISO8601()
  dayDate: string;

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
