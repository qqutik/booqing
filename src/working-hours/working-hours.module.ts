import { Module } from '@nestjs/common';
import { WorkingHoursService } from './working-hours.service.js';
import { WorkingHoursController } from './working-hours.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingHours } from './entities/working-hours.entity.js';
import { ResourcesModule } from '../resources/resources.module.js';

@Module({
  providers: [WorkingHoursService],
  controllers: [WorkingHoursController],
  imports: [ResourcesModule,TypeOrmModule.forFeature([WorkingHours])],
})
export class WorkingHoursModule {}
