import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces';
import { comparePassword, hashPassword } from 'src/utils/encryption';
import { MessagingService } from '../messanging/messanging.service';
import { messagingConfig } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private messagingService: MessagingService,
  ) {}

  async register(user: CreateUserDto) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (findUser) {
        throw new Error('Email ya registrado.');
      }

      await this.prisma.user.create({
        data: {
          ...user,
          password: await hashPassword(user.password),
        },
      });
      this.messagingService.sendRegisterUserEmail({
        from: messagingConfig.emailSender,
        to: user.email,
      });
      return {
        message: 'Se creo correctamente',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(credentials: LoginAuthDto) {
    try {
      const { email, password } = credentials;
      const findUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        throw new Error('Credenciales invalidas.');
      }

      const isCorrectPassword = await comparePassword(
        password,
        findUser.password,
      );

      if (!isCorrectPassword) {
        throw new Error('Credenciales invalidas.');
      }

      const payload: JwtPayload = {
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      };

      const token = await this.createTokens(payload);

      return {
        user: findUser,
        token,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  private async createTokens(payload: JwtPayload) {
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
