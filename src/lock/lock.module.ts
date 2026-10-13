import { LockService } from './lock.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [LockService],
  exports: [LockService],
})
export class LockModule {}