import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { ChartModule } from '../chart/chart.module';
import { PrinterModule } from '../printer/printer.module';
import { MercadopagoModule } from '../mercadopago/mercadopago.module';

@Module({
  imports: [ChartModule, PrinterModule, MercadopagoModule],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
