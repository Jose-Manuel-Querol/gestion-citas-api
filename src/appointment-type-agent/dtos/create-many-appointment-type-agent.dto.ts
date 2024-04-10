import { IsNotEmpty } from 'class-validator';
import { CreateAppointmentTypeAgent } from './create-appointment-type-agent.dto';

export class CreateManyAppointmentTypeAgent {
  @IsNotEmpty()
  createAppointmentTypeAgents: CreateAppointmentTypeAgent[];
}
