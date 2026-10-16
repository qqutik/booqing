import { ConfigService } from '@nestjs/config';

export abstract class BaseProcessor {
  public constructor(protected readonly config: ConfigService) {}

  protected getSessionExpiresAt(): Date {
    const minutes = this.config.getOrThrow<number>('PAYMENT_SESSION_MINUTES');
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  protected buildSuccessUrl(uuid: string): string {
    return `${this.config.getOrThrow<string>('STRIPE_SUCCESS_URL')}/${uuid}`;
  }

  protected buildCancelUrl(uuid: string): string {
    return `${this.config.getOrThrow<string>('STRIPE_CANCEL_URL')}/${uuid}`;
  }
}
