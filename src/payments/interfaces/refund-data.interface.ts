import { CurrencyEnum } from '../../resources/enums/currency.enum.js';

export interface RefundData {
  uuid: string;
  price: number;
  currency: CurrencyEnum;
}