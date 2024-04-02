import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  locationName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  addressNro: string;

  @IsNotEmpty()
  @IsNumber()
  zoneId: number;
}
