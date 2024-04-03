import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateAppointmentTypeAgent } from './create-appointment-type-agent.dto';

export class CreateManyAppointmentTypeAgent {
  @IsNotEmpty()
  @IsNumber()
  agentId: number;

  @IsNotEmpty()
  createAppointmentTypeAgents: CreateAppointmentTypeAgent[];
}
