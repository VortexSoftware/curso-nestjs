import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces';
import { comparePassword, hashPassword } from 'src/utils/encryption';
import { MessagingService } from '../messanging/messanging.service';
import { messagingConfig } from 'src/common/constants';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';

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

  async recoverPassword(body: RecoverPasswordDto) {
    const { email } = body;
    const findUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) {
      throw new Error('Usuario no encontrado.');
    }

    const payload: JwtPayload = {
      id: findUser.id,
      email: findUser.email,
      role: findUser.role,
    };

    const token = await this.createTokens(payload);

    this.messagingService.sendRecoverPasswordEmail({
      from: messagingConfig.emailSender,
      to: findUser.email,
      redirectUrl: `${messagingConfig.resetPasswordUrls}/${token.accessToken}`,
    });
    return {
      message: 'Se envio un correo para recuperar la contraseña',
    };
  }

  async resetPassword(id: string, body: ResetPasswordDto) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!findUser) {
      throw new Error('Usuario no encontrado.');
    }
    if (body.password !== body.confirmPassword) {
      throw new Error('Las contraseñas no coinciden.');
    }
    const samePassword = await comparePassword(
      body.password,
      findUser.password,
    );
    if (samePassword) {
      throw new Error('La contraseña no puede ser la misma.');
    }
    await this.prisma.user.update({
      where: { id },
      data: { password: await hashPassword(body.password) },
    });
    await this.messagingService.sendResetPasswordEmail({
      from: messagingConfig.emailSender,
      to: findUser.email,
    });
    return {
      message: 'Se restablecio correctamente su contraseña',
    };
  }

  private async createTokens(payload: JwtPayload) {
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
