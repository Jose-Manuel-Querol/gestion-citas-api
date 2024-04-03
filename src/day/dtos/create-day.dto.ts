import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateDayDto {
  @IsNotEmpty()
  @IsString()
  dayName: string;

  @IsNotEmpty()
  @IsString()
  startingHour: string;

  @IsNotEmpty()
  @IsString()
  endingHour: string;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @IsNumber()
  appointmentTypeAgentId: number;
}
