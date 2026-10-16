import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service.js';
import { Payment } from './entities/payment.entity.js';
import { PaymentFactory } from './payment.factory.js';
import { StripeProcessor } from './processors/stripe/stripe-processor.service.js';
import { STRIPE_CLIENT } from './processors/stripe/stripe.constants.js';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [
    PaymentsService,
    PaymentFactory,
    StripeProcessor,
    {
      provide: STRIPE_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Stripe(config.getOrThrow<string>('STRIPE_SECRET_KEY')),
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
