import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { SlotsController } from './slots.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './entities/slot.entity.js';
import { WorkingHoursModule } from '../working-hours/working-hours.module.js';
import { ResourcesModule } from '../resources/resources.module.js';
import { SlotsScheduler } from './slots.scheduler.js';
import { LockModule } from '../lock/lock.module.js';

@Module({
  providers: [SlotsService, SlotsScheduler],
  controllers: [SlotsController],
  imports: [
    LockModule,
    ResourcesModule,
    WorkingHoursModule,
    TypeOrmModule.forFeature([Slot]),
  ],
  exports: [SlotsService],
})
export class SlotsModule {}
