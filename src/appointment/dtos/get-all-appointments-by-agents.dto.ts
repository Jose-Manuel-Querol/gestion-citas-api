import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GetAllAppointmentsByAgents {
  @IsNotEmpty()
  @IsString()
  startingDate: string;

  @IsNotEmpty()
  @IsString()
  endingDate: string;

  @IsNotEmpty()
  @IsArray()
  agentsId: number[];
}
