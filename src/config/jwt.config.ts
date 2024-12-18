import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';

const JwtModuleConfig = async () => {
  const options: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      };
    },
    inject: [ConfigService],
  };
  return JwtModule.registerAsync(options);
};

export default JwtModuleConfig;
