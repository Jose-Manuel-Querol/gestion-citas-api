import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { FranjaDto } from '../../franja/dtos/franja.dto';

export class DayDto {
  @IsOptional()
  @IsNumber()
  dayId: number;

  @IsOptional()
  @IsString()
  dayName: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FranjaDto)
  franjas: FranjaDto[];
}
