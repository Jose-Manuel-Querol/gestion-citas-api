import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateManyAppointmentTypeAgent } from '../../appointment-type-agent/dtos/create-many-appointment-type-agent.dto';
import { CreateManyVacationDays } from '../../vacation-day/dtos/create-many-vacation-days.dto';
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
  dni: string;

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
  @IsNumber()
  zoneId: number;

  @IsNotEmpty()
  appointmentTypeAgents: CreateManyAppointmentTypeAgent;

  @IsNotEmpty()
  vacationDays: CreateManyVacationDays;
}
