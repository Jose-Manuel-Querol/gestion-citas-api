import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFranjaDto {
  @IsNotEmpty()
  @IsString()
  startingHour: string;

  @IsNotEmpty()
  @IsString()
  endingHour: string;
}
