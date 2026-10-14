import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import type { Resource } from '../../resources/entities/resource.entity.js';
import type { User } from '../../users/entities/user.entity.js';
import type { Booking } from '../../bookings/entities/booking.entity.js';

@Check('rating BETWEEN 1 AND 5')
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingId: number;

  @OneToOne('Booking', { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  booking: Relation<Booking>;

  @Index()
  @Column()
  resourceId: number;

  @ManyToOne('Resource', { nullable: false, onDelete: 'CASCADE' })
  resource: Relation<Resource>;

  @Column()
  userId: number;

  @ManyToOne('User', { nullable: false, onDelete: 'RESTRICT' })
  user: Relation<User>;

  @Column('smallint')
  rating: number;

  @Column('text', { nullable: true })
  comment: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
