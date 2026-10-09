import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email },
      select: { id: true, email: true, password: true, type: true },
    });
  }

  public async findById(id: number) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  public async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const { password, ...rest } = createUserDto;
    const hashedPassword = await argon2.hash(password);
    const user = this.repository.create({
      ...rest,
      password: hashedPassword,
    });
    return this.repository.save(user);
  }
}
