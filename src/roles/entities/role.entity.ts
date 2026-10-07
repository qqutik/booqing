import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEnum } from '../enums/role.enum.js';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RoleEnum, unique: true, nullable: false })
  alias: RoleEnum;

  @Column('varchar', { length: 255 })
  name: string;
}