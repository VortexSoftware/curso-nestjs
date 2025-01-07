import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { ExcelService } from '../excel/excel.service';

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
        data: { ...updateUserDto, profilePhoto: url },
      })
      .catch(() => {
        this.awsService.deleteFile(key);
      });
    return user;
  }

  async exportAllExcel(res: Response) {
    const users = await this.prisma.user.findMany({
      where: {
        isDeleted: false,
      },
    });

    const columns = [
      { header: 'ID', key: 'id' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Role', key: 'role' },
    ];

    const workbook = await this.excelService.generateExcel(users, columns);

    await this.excelService.exportToResponse(res, workbook, 'users.xlsx');
  }
}
