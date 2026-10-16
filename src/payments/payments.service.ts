import { Injectable } from '@nestjs/common';
import { Payment } from './entities/payment.entity.js';
import { PaymentFactory } from './payment.factory.js';
import type { PurchaseRequest } from './interfaces/requests/purchase-request.interface.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatusEnum } from './enums/payment-status.enum.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
    private readonly factory: PaymentFactory,
  ) {}

  public async purchase(data: PurchaseRequest) {
    const payment = this.repository.create({
      ...data,
      status: PaymentStatusEnum.PENDING,
    });
    await this.repository.save(payment);

    try {
      const processor = this.factory.getProcessor(data.provider);

      const result = await processor.purchase({
        uuid: payment.uuid,
        price: payment.price,
        currency: payment.currency,
      });

      payment.checkoutId = result.checkoutId;
      payment.response = result.response;
      return result.checkoutUrl;

    }catch (error) {
      payment.status = PaymentStatusEnum.FAILED;
      throw error;
    }finally {
      await this.repository.save(payment);
    }
  }
  public webhook(): void {
    throw new Error('Method not implemented.');
  }
  public refund(): Payment {
    throw new Error('Method not implemented.');
  }
}
