import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import type { Slot } from '../../slots/entities/slot.entity.js';
import type { User } from '../../users/entities/user.entity.js';
import { BookingStatusEnum } from '../enums/booking-status.enum.js';
import { CurrencyEnum } from '../../resources/enums/currency.enum.js';

@Index('unique_bookings_active_slot', ['slotId'], {
  unique: true,
  where: `"status" <> 'cancelled'`,
})
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slotId: number;

  @ManyToOne('Slot', {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  slot: Relation<Slot>;

  @Index()
  @Column()
  userId: number;

  @ManyToOne('User', {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  user: Relation<User>;

  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
    default: BookingStatusEnum.PENDING,
  })
  status: BookingStatusEnum;

  @Column('integer', { default: 0 })
  price: number;

  @Column('varchar', { length: 3, default: CurrencyEnum.UAH })
  currency: CurrencyEnum;

  @Column('timestamptz', { nullable: true })
  cancelledAt: Date | null;

  @Column('timestamptz', { nullable: true })
  confirmationSentAt: Date | null;

  @Column('timestamptz', { nullable: true })
  reminderSentAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}