import { Payment } from './entities/payment.entity.js';

export abstract class PaymentProviderAbstract {

  public abstract purchase(): Payment;

  public abstract webhook(): void;

  public abstract refund(): Payment;
}