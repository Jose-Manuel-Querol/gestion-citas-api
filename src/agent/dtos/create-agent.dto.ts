import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateManyAppointmentTypeAgent } from '../../appointment-type-agent/dtos/create-many-appointment-type-agent.dto';
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
  @IsString()
  vacationStart: string;

  @IsNotEmpty()
  @IsString()
  vacationEnd: string;

  @IsNotEmpty()
  @IsNumber()
  zoneId: number;

  @IsNotEmpty()
  appointmentTypeAgents: CreateManyAppointmentTypeAgent;
}
