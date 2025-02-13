import { Controller, Post, Req, Logger } from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';
const logger = new Logger('PaymentController');

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    logger.log(req);
    const event = req.body;
    return this.paymentService.mercadopagoWebhook(event);
  }
}
