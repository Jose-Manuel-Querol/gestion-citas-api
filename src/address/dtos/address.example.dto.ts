import { ApiProperty } from '@nestjs/swagger';

export class AddressExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID de una direcci',
  })
  addressId: number;

  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the example',
  })
  addressType: string;

  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the example',
  })
  code: number;

  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the example',
  })
  addressName: string;

  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the example',
  })
  createdAt: Date;
}
