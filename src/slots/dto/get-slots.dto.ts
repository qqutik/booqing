import { IsISO8601, IsOptional, IsTimeZone } from 'class-validator';

export class GetSlotsDto {
  @IsISO8601()
  from: string;

  @IsISO8601()
  to: string;

  @IsOptional()
  @IsTimeZone()
  timezone?: string;
}