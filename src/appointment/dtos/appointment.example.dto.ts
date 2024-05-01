import { ApiProperty } from '@nestjs/swagger';
import { AppointmentTypeAgent } from '../../appointment-type-agent/appointment-type-agent.entity';
import { AppointmentTypeAgentExampleDto } from './appointment-type-agent.example.dto';
import { LocationExampleDto } from './location.example.dto';
import { Day } from '../../day/day.entity';
import { DayExampleDto } from './day.example.dto';
import { Location } from '../../location/location.entity';

export class AppointmentExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de la cita',
  })
  appointmentId: number;

  @ApiProperty({
    example: 'Stephano Palomino',
    description: 'Nombre completo del cliente que agendo la cita',
  })
  clientName: string;

  @ApiProperty({
    example: '676491195',
    description: 'Número celular del cliente',
  })
  clientPhoneNumber: string;

  @ApiProperty({
    example: 'CALLE AGUILA 114',
    description: 'Dirección del cliente',
  })
  clientAddress: string;

  @ApiProperty({
    example: '72942',
    description: 'Código de la cita',
  })
  code: string;

  @ApiProperty({
    example: '12:30',
    description: 'Hora de inicio de la cita',
  })
  startingHour: string;

  @ApiProperty({
    example: '13:00',
    description: 'Hora de fin de la cita',
  })
  endingHour: string;

  @ApiProperty({
    example: false,
    description: 'Determina si la cita fue cancelada o no',
  })
  cancelled: boolean;

  @ApiProperty({
    example: '2024-05-03T05:00:00.000Z',
    description: 'Fecha de la cita',
  })
  dayDate: string;

  @ApiProperty({
    type: AppointmentTypeAgentExampleDto,
    description: 'Tabla intermedia que contiene agentes y tipos de cita',
  })
  appointmentTypeAgent: AppointmentTypeAgent;

  @ApiProperty({
    type: LocationExampleDto,
    description: 'Ubicación de la Cita',
  })
  location: Location;

  @ApiProperty({
    type: DayExampleDto,
    description: 'Día de la cita',
  })
  day: Day;
}
