import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/constants';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { PaginationArgs } from 'src/utils/pagination/pagination.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCustomOperation({
    summary: 'Create a new user',
    bodyType: CreateUserDto,
    responseStatus: 200,
    responseDescription: 'User created successfully',
  })
  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiCustomOperation({
    summary: 'get all users',
    responseStatus: 200,
    responseDescription: 'Return all users',
  })
  @Get()
  findAll(@Query() pagination: PaginationArgs) {
    return this.usersService.findAllUserWithPagination(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = req.user;
    await this.usersService.updateUser(userId, updateUserDto, file);
  }
  @Get('export/excel')
  findAllByProfessionalExcel(@Res() res: Response) {
    return this.usersService.exportAllExcel(res);
  }

  @Post('upload/excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUsers(@UploadedFile() file: Express.Multer.File) {
    const data = await this.usersService.uploadUsers(file.buffer);
    return data;
  }
}
