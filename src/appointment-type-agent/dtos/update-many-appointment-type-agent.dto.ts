import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAppointmentTypeAgent } from './update-appointment-type-agent.dto';

export class UpdateManyAppointmentTypeAgent {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAppointmentTypeAgent)
  appointmentTypeAgents: UpdateAppointmentTypeAgent[];
}
