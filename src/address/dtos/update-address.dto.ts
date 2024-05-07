import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  addressType?: string;

  @IsOptional()
  @IsNumber()
  code?: number;

  @IsOptional()
  @IsString()
  addressName: string;

  @IsOptional()
  @IsString()
  zoneName: string;
}
