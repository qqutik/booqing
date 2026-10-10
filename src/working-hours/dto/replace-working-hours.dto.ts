import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { CreateWorkingHoursDto } from './create-working-hours.dto.js';

export class ReplaceWorkingHoursDto {
  @IsArray()
  @ArrayMaxSize(21)
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingHoursDto)
  intervals: CreateWorkingHoursDto[];
}
