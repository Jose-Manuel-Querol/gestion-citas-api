import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  dni: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  addressNro: string;

  @IsNotEmpty()
  @IsNumber()
  zoneId: number;

  @IsNotEmpty()
  appointmentTypeAgents: CreateManyAppointmentTypeAgent;

  @IsOptional()
  vacationDays: CreateManyVacationDays;
}
