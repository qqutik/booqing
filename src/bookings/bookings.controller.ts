import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public create(
    @Body() dto: CreateBookingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(dto, user.sub);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  public cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.cancel(id, user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAll(user.sub);
  }
}
