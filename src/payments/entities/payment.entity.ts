import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import {
  PaymentStatusEnum,
} from '../enums/payment-status.enum.js';
import type { Booking } from '../../bookings/entities/booking.entity.js';
import type { User } from '../../users/entities/user.entity.js';
import { CurrencyEnum } from '../../resources/enums/currency.enum.js';
import { PaymentProviderEnum } from '../enums/payment-provider.enum.js';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column('uuid', { unique: true })
  uuid: string;

  @Column({
    type: 'enum',
    enum: PaymentProviderEnum,
    default: PaymentProviderEnum.STRIPE,
  })
  provider: PaymentProviderEnum;

  @Index()
  @Column()
  bookingId: number;

  @ManyToOne('Booking', { nullable: false, onDelete: 'RESTRICT' })
  booking: Relation<Booking>;

  @Index()
  @Column()
  userId: number;

  @ManyToOne('User', { nullable: false, onDelete: 'RESTRICT' })
  user: Relation<User>;

  @Column('varchar', { length: 255, unique: true, nullable: true })
  paymentId: string | null;

  @Column('varchar', { length: 255, unique: true, nullable: true })
  checkoutId: string | null;

  @Column('integer')
  price: number;

  @Column('varchar', { length: 3, default: CurrencyEnum.UAH })
  currency: CurrencyEnum;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum;

  @Column('jsonb', { nullable: true })
  response: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}