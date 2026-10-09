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
} from 'typeorm';
import type { Resource } from '../../resources/entities/resource.entity.js';

@Check('start_time < end_time')
@Check('weekday BETWEEN 1 AND 7')
@Unique((fields) => [fields.resourceId, fields.weekday, fields.startTime])
@Entity('working_hours')
export class WorkingHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resourceId: number;

  @ManyToOne('Resource', (resource: Resource) => resource.workingHours, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  resource: Relation<Resource>;

  @Column('smallint')
  weekday: number;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
