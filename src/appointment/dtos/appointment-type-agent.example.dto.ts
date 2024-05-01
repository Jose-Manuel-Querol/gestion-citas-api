import { ApiProperty } from '@nestjs/swagger';
import { AppointmentType } from '../../appointment-type/appointment-type.entity';
import { Agent } from '../../agent/agent.entity';
import { AppointmentTypeExampleDto } from './appointment-type.example.dto';
import { AgentExampleDto } from './agent.example.dto';

export class AppointmentTypeAgentExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de la tabla intermedia entre tipo de cita y agente',
  })
  appointmentTypeAgentId: number;

  @ApiProperty({
    type: AppointmentTypeExampleDto,
    description: 'El tipo de la cita',
  })
  appointmentType: AppointmentType;

  @ApiProperty({
    type: AgentExampleDto,
    description: 'El agente',
  })
  agent: Agent;
}
