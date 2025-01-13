import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

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

  async remove(id: string) {
    return await this.prisma.purchase.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
