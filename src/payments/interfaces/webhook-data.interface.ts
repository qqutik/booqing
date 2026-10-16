import { CurrencyEnum } from '../../resources/enums/currency.enum.js';

export interface WebhookData {
  uuid: string;
  price: number;
  currency: CurrencyEnum;
}