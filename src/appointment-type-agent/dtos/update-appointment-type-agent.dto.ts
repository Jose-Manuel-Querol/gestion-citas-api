import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { DayDto } from '../../day/dtos/day.dto';

export class UpdateAppointmentTypeAgent {
  @IsNotEmpty()
  @IsNumber()
  appointmentTypeAgentId: number;

  @IsNotEmpty()
  @IsNumber()
  appointmentTypeId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayDto)
  days: DayDto[];
}
