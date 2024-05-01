import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentExampleDto {
  @ApiProperty({
    example: 'Stephano Palomino',
    description: 'Nombre del completo del cliente',
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
    example: '2024-05-03T05:00:00.000Z',
    description: 'Fecha de la cita',
  })
  dayDate: string;

  @ApiProperty({
    example: 1,
    description: 'El ID de la tabla intermedia de agentes y tipos de cita',
  })
  appointmentTypeAgentId: number;

  @ApiProperty({
    example: 1,
    description: 'El ID de un centro de atención',
  })
  locationId: number;

  @ApiProperty({
    example: 1,
    description: 'El ID de un día',
  })
  dayId: number;
}
