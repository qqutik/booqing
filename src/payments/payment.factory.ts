
import { StripeProcessor } from './processors/stripe/stripe-processor.service.js';
import { PaymentProviderAbstract } from './payment-provider.abstract.js';
import { PaymentProviderEnum } from './enums/payment-provider.enum.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentFactory {

  constructor(
    private readonly stripeProcessor: StripeProcessor,
  ) {
  }

  public getProcessor(type: PaymentProviderEnum) : PaymentProviderAbstract {
    switch (type) {
      case PaymentProviderEnum.STRIPE:
        return this.stripeProcessor;
      default: {
        const unreachable: never = type;
        throw new Error(`Unsupported payment provider: ${unreachable}`);
      }
    }
  }
}
