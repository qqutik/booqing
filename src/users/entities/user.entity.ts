import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity.js';
import { UserTypeEnum } from '../enums/user-type.enum.js';
import type { Resource } from '../../resources/entities/resource.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column('varchar', { length: 255, nullable: false, select: false })
  password: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: UserTypeEnum })
  type: UserTypeEnum;

  @Column('varchar', { length: 255, nullable: false, default: 'UTC' })
  timezone: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @OneToMany('Resource', (resource: Resource) => resource.user)
  resources: Resource[];
}
