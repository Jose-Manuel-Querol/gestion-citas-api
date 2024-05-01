import { ApiProperty } from '@nestjs/swagger';

export class FranjaExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de la franja horaria de un día',
  })
  franjaId: number;

  @ApiProperty({
    example: '11:00',
    description: 'Hora de inicio de la franja horaria',
  })
  startingHour: string;

  @ApiProperty({
    example: '14:30',
    description: 'Hora de fin de la franja horaria',
  })
  endingHour: string;
}
