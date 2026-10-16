import { WebhookResponse } from './interfaces/responses/webhook-response.interface.js';
import { RefundResponse } from './interfaces/responses/refund-response.interface.js';
import { PurchaseResponse } from './interfaces/responses/purchase-response.interface.js';
import { PurchaseData } from './interfaces/purchase-data.interface.js';
import { WebhookData } from './interfaces/webhook-data.interface.js';
import { RefundData } from './interfaces/refund-data.interface.js';

export abstract class PaymentProviderAbstract {
  public abstract purchase(data: PurchaseData): Promise<PurchaseResponse>;

  public abstract webhook(data: WebhookData): Promise<WebhookResponse>;

  public abstract refund(data: RefundData): Promise<RefundResponse>;
}