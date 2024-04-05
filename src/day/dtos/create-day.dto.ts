import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
export class CreateDayDto {
  @IsNotEmpty()
  @IsString()
  dayName: string;

  @IsNotEmpty()
  @IsString()
  dayDate: Date;

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
