import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';

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

  // ******** RESET PASSWORD ********
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto, @Req() req) {
    const { userId } = req.user;
    return this.authService.resetPassword(userId, body);
  }
}
