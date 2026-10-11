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

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
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

  @Column('timestamptz', { nullable: true })
  cancelledAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}