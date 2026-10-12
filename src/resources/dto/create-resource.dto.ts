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
  Min,
} from 'class-validator';
import { ResourceTypeEnum } from '../enums/resource-type.enum.js';
import { CurrencyEnum } from '../enums/currency.enum.js';

export class CreateResourceDto {
  @IsEnum(ResourceTypeEnum)
  type: ResourceTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

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
