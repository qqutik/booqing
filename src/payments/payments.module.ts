import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { Payment } from './entities/payment.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentFactory } from './payment.factory.js';
import { StripeProcessor } from './processors/stripe/stripe-processor.service.js';

@Module({
  providers: [PaymentsService, PaymentFactory, StripeProcessor],
  imports: [TypeOrmModule.forFeature([Payment])],
  exports: [PaymentsService],
})
export class PaymentsModule {}
