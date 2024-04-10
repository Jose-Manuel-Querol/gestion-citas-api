import { IsBoolean, IsISO8601, IsNotEmpty, IsString } from 'class-validator';
export class CreateDayDto {
  @IsNotEmpty()
  @IsString()
  dayName: string;

  @IsNotEmpty()
  @IsISO8601()
  dayDate: string;

  @IsNotEmpty()
  @IsString()
  startingHour: string;

  @IsNotEmpty()
  @IsString()
  endingHour: string;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
