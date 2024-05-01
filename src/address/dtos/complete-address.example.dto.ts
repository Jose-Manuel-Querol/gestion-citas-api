import { ApiProperty } from '@nestjs/swagger';

export class CompleteAddressExampleDto {
  @ApiProperty({
    example: 'CALLE AGUSTINA DE ARAGON',
    description: 'Dirección completa',
  })
  address: string;
}
