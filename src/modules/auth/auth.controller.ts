import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login.dto';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';
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

  @Post('/recovery-password')
  recoveryPassword(@Body() recoverDto: RecoverPasswordDto) {
    return this.authService.recoveryPassword(recoverDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  resetPassword(@Body() resetDto: ResetPasswordDto, @Req() req) {
    const id = req.user.userId;
    return this.authService.resetPassword(resetDto, id);
  }
}
