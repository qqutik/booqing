import { IsEnum, IsISO8601, IsOptional, IsTimeZone } from 'class-validator';
import { SlotStatusEnum } from '../enums/slot-status.enum.js';

export class GetSlotsDto {
  @IsISO8601()
  from: string;

  @IsISO8601()
  to: string;

  @IsOptional()
  @IsEnum(SlotStatusEnum)
  status?: SlotStatusEnum;

  @IsOptional()
  @IsTimeZone()
  timezone?: string;
}
