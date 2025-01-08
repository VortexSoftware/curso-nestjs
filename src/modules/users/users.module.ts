import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AwsModule } from '../aws/aws.module';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [AwsModule, ExcelModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
