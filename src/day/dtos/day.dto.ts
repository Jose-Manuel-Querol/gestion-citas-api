import {
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DayDto {
  @IsOptional()
  @IsNumber()
  dayId: number;

  @IsOptional()
  @IsString()
  dayName: string;

  @IsOptional()
  @IsISO8601()
  dayDate: string;

  @IsOptional()
  @IsString()
  startingHour: string;

  @IsOptional()
  @IsString()
  endingHour: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
