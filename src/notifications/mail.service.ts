import { createTransport, Transporter } from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(config: ConfigService) {
    this.transporter = createTransport({
      host: config.getOrThrow<string>('MAIL_HOST'),
      port: config.getOrThrow<number>('MAIL_PORT'),
      secure: false,
    });
    this.from = config.getOrThrow<string>('MAIL_FROM');
  }

  public async send(to: string, subject: string, text: string) {
    await this.transporter.sendMail({ from: this.from, to, subject, text });
  }
}
