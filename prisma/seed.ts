import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/encryption';
import { USERS } from '../src/utils/mocks';

const prisma = new PrismaClient();

async function main() {
  // ###################################
  // ############ USERS
  // ###################################
  const hashedPassword = await hashPassword('Pass1234');
  const dataUsers: Prisma.UserCreateManyInput[] = USERS.map((user) => ({
    ...user,
    password: hashedPassword,
    createdAt: faker.date.recent(),
  }));
  await prisma.user.createMany({
    data: dataUsers,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
