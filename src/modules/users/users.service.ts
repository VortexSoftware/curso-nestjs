import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
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
    console.log('updateUserDto', updateUserDto);
    console.log('id', id);
    const url = await this.awsService.uploadFile(file, id);
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: { ...updateUserDto, address: url },
    });
    return user;
  }
}
