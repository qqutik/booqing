import { Injectable } from '@nestjs/common';
import { Payment } from './entities/payment.entity.js';
import { PaymentFactory } from './payment.factory.js';
import { PaymentProviderEnum } from './enums/payment-provider.enum.js';

@Injectable()
export class PaymentsService {
  constructor(private readonly factory: PaymentFactory) {
  }

  public purchase(): Payment {
    const processor = this.factory.getProcessor(PaymentProviderEnum.STRIPE);
    return processor.purchase();
  }
  public webhook(): void {
    throw new Error('Method not implemented.');
  }
  public refund(): Payment {
    throw new Error('Method not implemented.');
  }
}
