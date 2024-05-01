import { ApiProperty } from '@nestjs/swagger';
import { AppointmentTypeAgent } from '../../appointment-type-agent/appointment-type-agent.entity';
import { Franja } from '../../franja/franja.entity';
import { AppointmentTypeAgentExampleDto } from './appointment-type-agent.example.dto';
import { FranjaExampleDto } from './franja.example.dto';

export class DayExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de un dia',
  })
  dayId: number;

  @ApiProperty({
    example: 'Lunes',
    description: 'Nombre del día',
  })
  dayName: string;

  @ApiProperty({
    example: true,
    description: 'Determina si el día está activo o no',
  })
  active: boolean;

  @ApiProperty({
    type: AppointmentTypeAgentExampleDto,
    description: 'Tabla intermedia que contiene agentes y tipos de cita',
  })
  appointmentTypeAgent: AppointmentTypeAgent;

  @ApiProperty({
    type: [FranjaExampleDto],
    description: 'Franjas horarias',
  })
  franjas: Franja[];
}
