import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { ExcelColumn } from 'src/common/interfaces';
import { ExcelService } from '../excel/excel.service';
import { PaginationArgs } from 'src/utils/pagination/pagination.dto';
import { Prisma } from '@prisma/client';
import { Paginate } from 'src/utils/parsing';
import { getPaginationFilter } from 'src/utils/pagination/pagination.utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly excelService: ExcelService,
  ) {}

  create(newUser: CreateUserDto) {
    const user = this.prisma.user.create({
      data: newUser,
    });
    return user;
  }

  findAll() {
    const users = this.prisma.user.findMany({
      where: {
        isDeleted: false,
      },
    });
    return users;
  }

  async findAllUserWithPagination(pagination: PaginationArgs) {
    const { search } = pagination;

    const where: Prisma.UserWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const baseQuery = {
      where,
      ...getPaginationFilter(pagination),
    };

    const total = await this.prisma.user.count({ where });
    const dataUsers = await this.prisma.user.findMany(baseQuery);

    const res = Paginate(dataUsers, total, pagination);
    return res;
  }

  findOne(id: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return updatedUser;
  }

  remove(id: string) {
    const deletedUser = this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    return deletedUser;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    const { url, key } = await this.awsService.uploadFile(file, id);
    console.log(url);

    const user = await this.prisma.user
      .update({
        where: {
          id,
        },
        data: { ...updateUserDto, address: url },
      })
      .catch(async () => {
        await this.awsService.deleteFile(key);
        console.log('Error');
        await this.prisma.user.update({
          where: {
            id,
          },
          data: { address: '' },
        });
      });
    return user;
  }

  async exportAllExcel(res: Response) {
    const users = await this.findAll();

    const columns: ExcelColumn[] = [
      { header: 'Nombre', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Telefono', key: 'phone' },
      { header: 'Rol de Usuario', key: 'role' },
    ];

    const workbook = await this.excelService.generateExcel(
      users,
      columns,
      'Usuarios',
    );
    const buffer = await Buffer.from(await workbook.xlsx.writeBuffer());
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'usuarios.xlsx',
      encoding: '7bit',
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: buffer.length,
      buffer: buffer,
      destination: '',
      filename: '',
      path: '',
      stream: null,
    };
    const { url } = await this.awsService.uploadFile(file, 'excel');
    await this.prisma.report.create({
      data: { content: url, type: 'Usuario' },
    });
    await this.excelService.exportToResponse(res, workbook, 'usuarios.xlsx');
  }

  async uploadUsers(buffer: Buffer) {
    const users = await this.excelService.readExcel(buffer);
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      await this.create(element);
    }
    return { message: 'Usuarios creados correctamente' };
  }
}
