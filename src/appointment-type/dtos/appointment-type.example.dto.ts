import { ApiProperty } from '@nestjs/swagger';

export class AppointmentTypeExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de un tipo de cita',
  })
  appointmentTypeId: number;

  @ApiProperty({
    example: 'medicina general',
    description: 'El nombre del tipo de cita',
  })
  typeName: string;

  @ApiProperty({
    example: '30',
    description: 'Duración del tipo de cita en minutos',
  })
  duration: string;
}
