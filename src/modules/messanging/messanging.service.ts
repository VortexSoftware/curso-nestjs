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

  async sendRecoverPasswordEmail(input: {
    from: string;
    to: string;
    redirectUrl: string;
  }) {
    const { from, to, redirectUrl } = input;
    const subject = 'Recupera tu contraseña';
    const body = `Haz click en el siguiente enlace para recuperar tu contraseña: ${redirectUrl}`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }
}
