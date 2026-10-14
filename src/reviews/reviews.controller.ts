import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Controller()
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/bookings/:bookingId/review')
  public create(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(bookingId, dto, user.sub);
  }

  @Get('/resources/:resourceId/reviews')
  public findAll(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findAll(resourceId, pagination);
  }

  @Get('/resources/:resourceId/rating')
  public getRating(@Param('resourceId', ParseIntPipe) resourceId: number) {
    return this.service.getRating(resourceId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/reviews/:id')
  public delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.delete(id, user.sub);
  }
}
