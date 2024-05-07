import { IsString } from 'class-validator';

export class UpdateVacationDto {
  @IsString()
  vacationDayDate: string;
}
