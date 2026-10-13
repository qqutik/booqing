import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserTypeGuard } from '../auth/guards/user-type.guard.js';
import { UserTypes } from '../auth/decorators/user-types.decorator.js';
import { UserTypeEnum } from '../users/enums/user-type.enum.js';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { GetSlotsDto } from './dto/get-slots.dto.js';

@Controller('resources/:resourceId/slots')
export class SlotsController {
  constructor(private readonly service: SlotsService) {}
  @Post('/generate')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes([UserTypeEnum.PROVIDER])
  public generate(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.generate(resourceId, user.sub);
  }

  @Get()
  public findAll(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Query() dto: GetSlotsDto,
  ) {
    return this.service.findAll(resourceId, dto);
  }
}
