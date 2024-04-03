import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsString()
  addressType?: string;

  @IsOptional()
  @IsNumber()
  code?: number;

  @IsNotEmpty()
  @IsString()
  addressName: string;

  @IsNotEmpty()
  @IsString()
  zoneName: string;
}
