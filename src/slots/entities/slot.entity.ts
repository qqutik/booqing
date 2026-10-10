import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import type { Resource } from '../../resources/entities/resource.entity.js';
import { SlotStatusEnum } from '../enums/slot-status.enum.js';

@Check('start_at < end_at')
@Unique((fields) => [fields.resourceId, fields.startAt])
@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resourceId: number;

  @ManyToOne('Resource',{
    nullable: false,
    onDelete: 'CASCADE',
  })
  resource: Relation<Resource>;

  @Column({
    type: 'enum',
    enum: SlotStatusEnum,
    default: SlotStatusEnum.AVAILABLE,
  })
  status: SlotStatusEnum;

  @VersionColumn()
  version: number;

  @Column('timestamptz')
  startAt: Date;

  @Column('timestamptz')
  endAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
