import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsTimeZone,
  Max,
  MaxLength,
} from 'class-validator';
import { ResourceTypeEnum } from '../enums/resource-type.enum.js';

export class CreateResourceDto {
  @IsEnum(ResourceTypeEnum)
  type: ResourceTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsInt()
  @Max(1440)
  @IsPositive()
  slotDurationMinutes: number;

  @IsTimeZone()
  timezone: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
