import { PrismaClient } from '@prisma/client';

import { dbIdGenerator } from '../src/shared/helpers/nanoid-generator.helper';

const prisma = new PrismaClient();

async function main() {
  await prisma.button.create({
    data: {
      id: dbIdGenerator(),
      latitude: 52.5067614,
      longitude: 13.4221333,
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
