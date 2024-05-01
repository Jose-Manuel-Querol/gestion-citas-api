import { ApiProperty } from '@nestjs/swagger';

export class ZoneExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de una zona',
  })
  zoneId: number;

  @ApiProperty({
    example: 'I',
    description: 'Nombre de la zona',
  })
  zoneName: string;
}
