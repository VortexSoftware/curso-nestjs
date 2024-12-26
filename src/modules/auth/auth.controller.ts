import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login.dto';
import {
  RecoverPasswordDto,
  ResetPasswordDto,
} from './dto/recovery-password.dto';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() credentials: LoginAuthDto) {
    return this.authService.login(credentials);
  }

  @Post('recover-password')
  recoverPassword(@Body() body: RecoverPasswordDto) {
    return this.authService.recoverPassword(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto, @Req() req) {
    const { userId } = req.user;
    return this.authService.resetPassword(userId, body);
  }
}
