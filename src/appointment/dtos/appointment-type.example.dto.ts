import { ApiProperty } from '@nestjs/swagger';

export class AppointmentTypeExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID del tipo de cita',
  })
  appointmentTypeId: number;

  @ApiProperty({
    example: 'traumatología',
    description: 'El nombre del tipo de cita',
  })
  typeName: string;

  @ApiProperty({
    example: '30',
    description: 'La duración en minutos del tipo de cita',
  })
  duration: string;
}
