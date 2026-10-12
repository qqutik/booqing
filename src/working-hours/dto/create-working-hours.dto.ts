import { IsInt, IsMilitaryTime, IsOptional, Max, Min } from 'class-validator';

export class CreateWorkingHoursDto {
  @IsInt()
  @Min(1)
  @Max(7)
  weekday: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number | null;

  @IsMilitaryTime()
  startTime: string;

  @IsMilitaryTime()
  endTime: string;
}
