import { IsInt, IsMilitaryTime, Max, Min } from 'class-validator';

export class CreateWorkingHoursDto {
  @IsInt()
  @Min(1)
  @Max(7)
  weekday: number;

  @IsMilitaryTime()
  startTime: string;

  @IsMilitaryTime()
  endTime: string;
}
