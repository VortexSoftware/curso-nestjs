import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { ChartModule } from '../chart/chart.module';
import { PrinterModule } from '../printer/printer.module';

@Module({
  imports: [ChartModule, PrinterModule],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
