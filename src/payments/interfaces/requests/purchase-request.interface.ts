import { PaymentProviderEnum } from '../../enums/payment-provider.enum.js';
import { CurrencyEnum } from '../../../resources/enums/currency.enum.js';

export interface PurchaseRequest{
  provider: PaymentProviderEnum;
  bookingId: number;
  userId: number;
  price: number;
  currency: CurrencyEnum;
}