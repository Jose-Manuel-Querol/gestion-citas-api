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

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  addressNro: string;

  @IsOptional()
  @IsNumber()
  zoneId: number;

  @IsOptional()
  appointmentTypeAgents: CreateManyAppointmentTypeAgent;

  @IsOptional()
  vacationDays: CreateManyVacationDays;
}
