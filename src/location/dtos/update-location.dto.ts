import { IsString, IsOptional, IsNumber } from 'class-validator';
export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  locationName: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  addressNro: string;

  @IsOptional()
  @IsNumber()
  zoneId: number;
}
