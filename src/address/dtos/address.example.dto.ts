import { ApiProperty } from '@nestjs/swagger';
import { ZoneExampleDto } from '../../appointment/dtos/zone.example.dto';
import { Zone } from '../../zone/zone.entity';

export class AddressExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de una dirección',
  })
  addressId: number;

  @ApiProperty({
    example: 'CALLE',
    description: 'Tipo de dirección',
  })
  addressType: string;

  @ApiProperty({
    example: 2,
    description: 'Código de la dirección',
  })
  code: number;

  @ApiProperty({
    example: 'AGUSTINA DE ARAGON',
    description: 'Nombre de la dirección',
  })
  addressName: string;

  @ApiProperty({
    type: ZoneExampleDto,
    description: 'Zona de la dirección',
  })
  zone: Zone;
}
