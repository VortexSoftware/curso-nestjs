import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/constants';
import { Response } from 'express';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() req: any) {
    const { userId } = req.user;
    return this.purchaseService.create(createPurchaseDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Get()
  findAllByUser(@Req() req) {
    const { userId } = req.user;
    return this.purchaseService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(id);
  }

  @Get('chart/bar')
  async getPurchaseBarChart(@Res() res: Response) {
    const buffer = await this.purchaseService.generatePurchaseBarChart();

    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  }
}
