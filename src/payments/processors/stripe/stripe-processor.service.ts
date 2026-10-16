import { BaseProcessor } from '../base-processor.base.js';
import { PaymentProviderAbstract } from '../../payment-provider.abstract.js';
import { PurchaseResponse } from '../../interfaces/responses/purchase-response.interface.js';
import { WebhookResponse } from '../../interfaces/responses/webhook-response.interface.js';
import { RefundResponse } from '../../interfaces/responses/refund-response.interface.js';
import { PurchaseData } from '../../interfaces/purchase-data.interface.js';
import { WebhookData } from '../../interfaces/webhook-data.interface.js';
import { RefundData } from '../../interfaces/refund-data.interface.js';
import {
  Inject,
  Injectable, Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './stripe.constants.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeProcessor
  extends BaseProcessor
  implements PaymentProviderAbstract
{
  private readonly logger = new Logger(StripeProcessor.name);

  public constructor(
    config: ConfigService,
    @Inject(STRIPE_CLIENT) private readonly stripeClient: Stripe,
  ) {
    super(config);
  }

  public async purchase(data: PurchaseData): Promise<PurchaseResponse> {
    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripeClient.checkout.sessions.create(
        {
          mode: 'payment',
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: data.currency.toLowerCase(),
                unit_amount: data.price,
                product_data: { name: 'Booking' },
              },
            },
          ],
          success_url: this.buildSuccessUrl(data.uuid),
          cancel_url: this.buildCancelUrl(data.uuid),
          client_reference_id: data.uuid,
          metadata: { paymentUuid: data.uuid },
          expires_at: Math.floor(this.getSessionExpiresAt().getTime() / 1000),
        },
        { idempotencyKey: 'purchase:' + data.uuid },
      );
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        this.logger.error(
          `Stripe purchase failed: type=${error.type} code=${error.code} message=${error.message}`,
          error.stack,
        );
      } else if (error instanceof Error) {
        this.logger.error(
          `Stripe purchase failed: ${error.message}`,
          error.stack,
        );
      }

      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        if (error.code === 'amount_too_small') {
          throw new UnprocessableEntityException(
            'Amount is too small for online payment',
            { cause: error },
          );
        }
        if (error.code === 'amount_too_large') {
          throw new UnprocessableEntityException(
            'Amount is too large for online payment',
            { cause: error },
          );
        }
      }

      if (
        error instanceof Stripe.errors.StripeConnectionError ||
        error instanceof Stripe.errors.StripeAPIError ||
        error instanceof Stripe.errors.StripeRateLimitError
      ) {
        throw new ServiceUnavailableException(
          'Payment provider is unavailable, try again later',
          { cause: error },
        );
      }

      throw error;
    }

    if (session.url === null) {
      throw new Error('Payment error');
    }

    return {
      checkoutUrl: session.url,
      checkoutId: session.id,
      response: { ...session },
    };
  }
  public async webhook(data: WebhookData): Promise<WebhookResponse> {
    throw new Error('Method not implemented.');
  }
  public async refund(data: RefundData): Promise<RefundResponse> {
    throw new Error('Method not implemented.');
  }
}
