import { Injectable } from '@nestjs/common';
import { BaseProcessor } from '../base-processor.base.js';
import { PaymentProviderAbstract } from '../../payment-provider.abstract.js';
import { Payment } from '../../entities/payment.entity.js';

@Injectable()
export class StripeProcessor extends BaseProcessor implements PaymentProviderAbstract {
  public purchase(): Payment {
    return new Payment()
    throw new Error('Method not implemented.');
  }
  public webhook(): void {
    throw new Error('Method not implemented.');
  }
  public refund(): Payment {
    throw new Error('Method not implemented.');
  }
}
