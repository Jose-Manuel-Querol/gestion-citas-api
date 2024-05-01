import { ApiProperty } from '@nestjs/swagger';
import { Zone } from '../../zone/zone.entity';
import { ZoneExampleDto } from './zone.example.dto';

export class LocationExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de una centro de atención',
  })
  locationId: number;

  @ApiProperty({
    example: 'Centro de Atención',
    description: 'Nombre del centro de atención',
  })
  locationName: string;

  @ApiProperty({
    example: 'CALLE AGUSTINA DE ARAGON',
    description: 'Dirección del centro de atención',
  })
  address: string;

  @ApiProperty({
    example: '111',
    description: 'Número de la dirección del centro',
  })
  addressNro: string;

  @ApiProperty({
    example: 'CALLE AGUSTINA DE ARAGON 111',
    description: 'Dirección completa del centro de atención',
  })
  fullAddress: string;

  @ApiProperty({
    type: ZoneExampleDto,
    description: 'Zona de la ubicación',
  })
  zone: Zone;
}
