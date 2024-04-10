import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateManyAppointmentTypeAgent } from '../../appointment-type-agent/dtos/update-many-appointment-type-agent.dto';
export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  dni: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  addressNro?: string;

  @IsOptional()
  @IsString()
  vacationStart?: string;

  @IsOptional()
  @IsString()
  vacationEnd?: string;

  @IsOptional()
  @IsNumber()
  zoneId?: number;

  @IsOptional()
  appointmentTypeAgents: UpdateManyAppointmentTypeAgent;
}
