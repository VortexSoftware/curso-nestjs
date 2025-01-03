import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_PROVIDER, EmailService } from './messanging.types';

@Injectable()
export class MessagingService {
  constructor(@Inject(EMAIL_PROVIDER) private emailService: EmailService) {}

  async sendRegisterUserEmail(input: { from: string; to: string }) {
    const { from, to } = input;
    const subject = 'Bienvenido a la plataforma';
    const body = `Gracias por registrarte en nuestra plataforma.`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }

  async sendRecoveryPassword(input: { from: string; to: string; url: string }) {
    const { from, to, url } = input;
    const subject = 'Cambio de contraseña';
    const body = `Para cambiar la contraseña utilice esta url ${url}.`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }
}
