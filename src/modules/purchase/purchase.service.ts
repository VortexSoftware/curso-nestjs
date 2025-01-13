import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ChartService } from '../chart/chart.service';
import { ChartConfiguration } from 'chart.js';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chartService: ChartService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto, userId: string) {
    try {
      const { purchaseLines, totalAmount } = createPurchaseDto;
      for (const line of purchaseLines) {
        const product = await this.prisma.product.findUnique({
          where: { id: line.productId },
        });
        if (!product || product.isDeleted) {
          throw new Error(
            `Producto con ID ${line.productId} no encontrado o eliminado`,
          );
        }

        if (product.stock < line.quantity) {
          throw new Error(
            `Stock insuficiente para el producto "${product.name}". Disponible: ${product.stock}`,
          );
        }
      }

      await this.prisma.purchase.create({
        data: {
          userId,
          totalAmount,
          purchaseLines: {
            create: purchaseLines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              subtotal: line.subtotal,
            })),
          },
        },
        include: { purchaseLines: true },
      });

      for (const line of purchaseLines) {
        await this.prisma.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return { message: 'Compra creada con éxito' };
    } catch (error) {
      return { message: 'Error al crear la compra', error: error.message };
    }
  }

  async findAll() {
    return await this.prisma.purchase.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.purchase.findUnique({ where: { id } });
  }

  async findAllByUser(userId: string) {
    return await this.prisma.purchase.findMany({
      where: { userId },
    });
  }
  async generatePurchaseBarChart(): Promise<Buffer> {
    const purchases = await this.prisma.purchase.findMany({
      select: { id: true, totalAmount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const groupedByDate = {};

    purchases.forEach((purchase) => {
      const date = purchase.createdAt.toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = 0;
      }
      groupedByDate[date] += Number(purchase.totalAmount);
    });
    const labels = Object.keys(groupedByDate);
    const data = Object.values(groupedByDate);

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Monto Total de Compras',
          data,
          backgroundColor: '#36A2EB',
        },
      ],
    };

    const chartOptions: ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Compras por Fecha',
        },
      },
    };

    return await this.chartService.generateChart(
      'bar',
      chartData,
      chartOptions,
    );
  }

  async remove(id: string) {
    return await this.prisma.purchase.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
