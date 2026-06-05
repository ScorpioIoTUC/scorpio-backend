import { PrismaClient, UserType } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const users = [
    {
      name: 'Pedro Zavala',
      email: 'pedro@example.com',
      pwd_encrypted: 'hashed-password-1',
      type: UserType.ADMIN,
    },
    {
      name: 'Maria Lopez',
      email: 'maria@example.com',
      pwd_encrypted: 'hashed-password-2',
      type: UserType.NORMAL,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });