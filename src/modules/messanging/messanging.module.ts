import { Module, Provider } from '@nestjs/common';
import { MessagingService } from './messanging.service';
import { EMAIL_PROVIDER } from './messanging.types';
import { MailjetService } from './provider/mailjet.service';

const mailServicePrivider: Provider = {
  provide: EMAIL_PROVIDER,
  useClass: MailjetService,
};
@Module({
  providers: [MessagingService, mailServicePrivider],
  exports: [MessagingService],
})
export class MessangingModule {}
