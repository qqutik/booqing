import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service.js';
import { ResourcesController } from './resources.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity.js';

@Module({
  providers: [ResourcesService],
  controllers: [ResourcesController],
  imports: [TypeOrmModule.forFeature([Resource])],
  exports: [ResourcesService],
})
export class ResourcesModule {}
