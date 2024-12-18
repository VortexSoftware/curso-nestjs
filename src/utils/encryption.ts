import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, +process.env.HASH_SALT);
  } catch (error) {
    Logger.error('Error al generar el hash de la contraseña');
    throw error;
  }
};

export const comparePassword = async (
  providedPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(providedPassword, hashedPassword);
  } catch (error) {
    Logger.error('Error al comparar la contraseña');
    throw error;
  }
};
