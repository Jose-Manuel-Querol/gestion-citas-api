import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class FranjaDto {
  @IsOptional()
  @IsNumber()
  franjaId: number;

  @IsNotEmpty()
  @IsString()
  startingHour: string;

  @IsNotEmpty()
  @IsString()
  endingHour: string;
}
