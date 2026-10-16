import { CurrencyEnum } from '../../resources/enums/currency.enum.js';

export interface PurchaseData {
  uuid: string;
  price: number;
  currency: CurrencyEnum;
}