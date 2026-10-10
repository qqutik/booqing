import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface.js';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto.js';
import { WorkingHoursService } from './working-hours.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserTypeGuard } from '../auth/guards/user-type.guard.js';
import { UserTypes } from '../auth/decorators/user-types.decorator.js';
import { UserTypeEnum } from '../users/enums/user-type.enum.js';
import { ReplaceWorkingHoursDto } from './dto/replace-working-hours.dto.js';

@Controller('resources/:resourceId/working-hours')
export class WorkingHoursController {
  constructor(private readonly service: WorkingHoursService) {}

  @Post()
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes([UserTypeEnum.PROVIDER])
  public create(
    @Body() dto: CreateWorkingHoursDto,
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(dto, resourceId, user.sub);
  }

  @Put()
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes([UserTypeEnum.PROVIDER])
  public sync(
    @Body() dto: ReplaceWorkingHoursDto,
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.sync(dto, resourceId, user.sub);
  }

  @Get()
  public findAll(@Param('resourceId', ParseIntPipe) resourceId: number) {
    return this.service.findAll(resourceId);
  }
}
