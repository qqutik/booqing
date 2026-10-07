import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  public async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // @Post('/login')
  // public async login(@Body() loginDto: LoginDto) {
  //   return this.authService.login(loginDto);
  // }
}
