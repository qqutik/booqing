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
import { ResourceTypeEnum } from '../enums/resource-type.enum.js';
import type { User } from '../../users/entities/user.entity.js';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: number;

  @ManyToOne('User', (user: User) => user.resources, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  user: Relation<User>;

  @Column({ type: 'enum', enum: ResourceTypeEnum })
  type: ResourceTypeEnum;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('integer')
  slotDurationMinutes: number;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('varchar', { length: 255, nullable: true })
  image: string | null;

  @Column('varchar', { length: 255, nullable: false, default: 'UTC' })
  timezone: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
