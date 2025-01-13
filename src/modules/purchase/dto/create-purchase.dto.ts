import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  IsPositive,
  IsNumber,
} from 'class-validator';

export class CreatePurchaseLineDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;
}

export class CreatePurchaseDto {
  @IsArray()
  @IsNotEmpty()
  purchaseLines: CreatePurchaseLineDto[];

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
}
