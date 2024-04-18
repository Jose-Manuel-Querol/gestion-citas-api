import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CreateFranjaDto } from '../../franja/dtos/create-franja.dto';
export class CreateDayDto {
  @IsNotEmpty()
  @IsString()
  dayName: string;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @IsArray()
  franjas: CreateFranjaDto[];
}
