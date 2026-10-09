import { Module } from '@nestjs/common';
import { WorkingHoursService } from './working-hours.service.js';
import { WorkingHoursController } from './working-hours.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingHours } from './entities/working-hours.entity.js';

@Module({
  providers: [WorkingHoursService],
  controllers: [WorkingHoursController],
  imports: [TypeOrmModule.forFeature([WorkingHours])],
})
export class WorkingHoursModule {}
