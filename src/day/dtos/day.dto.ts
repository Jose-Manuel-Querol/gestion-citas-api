import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class DayDto {
  @IsOptional()
  @IsNumber()
  dayId: number;

  @IsOptional()
  @IsString()
  dayName: string;

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
