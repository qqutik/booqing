import { Injectable, Logger } from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { ResourcesService } from '../resources/resources.service.js';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LockService } from '../lock/lock.service.js';

@Injectable()
export class SlotsScheduler {
  private readonly logger = new Logger(SlotsScheduler.name);

  constructor(
    private readonly slotsService: SlotsService,
    private readonly resourcesService: ResourcesService,
    private readonly lockService: LockService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  public async generateSlots() {
    await this.lockService.runExclusive(
      'generate-slots',
      3_600_000,
      async () => {
        const resources = await this.resourcesService.findActive();
        for (const resource of resources) {
          try {
            const slots = await this.slotsService.generateForResource(resource);
            this.logger.log(`Resource #${resource.id}: ${slots.length} slots`);
          } catch (error) {
            this.logger.error(
              `Resource #${resource.id}: slot generation failed`,
              error,
            );
          }
        }
      },
    );
  }
}
