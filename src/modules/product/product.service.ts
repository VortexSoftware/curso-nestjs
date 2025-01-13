import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly excelService: ExcelService,
  ) {}

  async uploadProducts(buffer: Buffer) {
    const products = await this.excelService.readExcel(buffer);

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      await this.prisma.product.create({ data: product });
    }
    return { message: 'Productos creados correctamente' };
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
