import { CreateResourceDto } from './create-resource.dto.js';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}
