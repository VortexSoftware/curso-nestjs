import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginAuthDto {
  @IsEmail({}, { message: i18nValidationMessage('errors.isEmail') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  email: string;

  @IsString({ message: i18nValidationMessage('errors.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  password: string;
}
