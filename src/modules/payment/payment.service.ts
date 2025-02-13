import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadopagoService } from '../mercadopago/mercadopago.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mercadopagoService: MercadopagoService,
    private readonly i18n: I18nService,
  ) {}

  async mercadopagoWebhook(event: any) {
    try {
      if (event.type === 'payment') {
        const paymentId = event.data.id;
        const payment = await this.mercadopagoService.getPayment(paymentId);
        if (payment.status === 'approved') {
          const purchaseId = payment.metadata.purchase_id;
          const purchase = await this.prisma.purchase.findFirst({
            where: {
              id: purchaseId,
              payment: { status: 'PENDING' },
            },
            include: { payment: true },
          });
          if (purchase) {
            await this.prisma.payment.update({
              where: { id: purchase.payment.id },
              data: { status: 'COMPLETED', paymentId },
            });
            return { message: 'Compra actualizada correctamente' };
          } else {
            throw new Error(this.i18n.t('errors.paymentCompleted'));
          }
        }
      }
    } catch (error) {
      return { message: 'Error al crear la compra', error: error.message };
    }
  }
}
