import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import JwtModuleConfig from 'src/config/jwt.config';

@Module({
  imports: [JwtModuleConfig()],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
