import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { SlotsController } from './slots.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './entities/slot.entity.js';

@Module({
  providers: [SlotsService],
  controllers: [SlotsController],
  imports: [TypeOrmModule.forFeature([Slot])],
})
export class SlotsModule {}
