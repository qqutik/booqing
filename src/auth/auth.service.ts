import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { User } from '../users/entities/user.entity.js';
import { LoginDto } from './dto/login.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.signToken(user);
  }

  public async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await argon2.verify(user.password, loginDto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signToken(user);
  }

  private async signToken(user: User) {
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      type: user.type,
    });
    return { access_token: token };
  }
}
