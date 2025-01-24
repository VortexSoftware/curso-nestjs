import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { envValidationSchema } from 'src/config/env-validation.config';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { PurchaseModule } from '../purchase/purchase.module';
import I18nModuleConfig from 'src/config/i18n.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema,
    }),
    I18nModuleConfig(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductModule,
    PurchaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
