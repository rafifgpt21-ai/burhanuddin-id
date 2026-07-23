import { PrismaClient } from "@prisma/client";

import {
  readSuperAdminSeed,
  upsertSuperAdmin,
} from "./seed-data/super-admin";

if (process.env.DATABASE_READY !== "true") {
  console.error(
    "Seed dibatalkan. Gunakan kredensial yang sudah dirotasi dan DATABASE_READY=true.",
  );
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const input = readSuperAdminSeed({ required: true });
  const user = await upsertSuperAdmin(prisma, input!);
  await prisma.adminSession.deleteMany({
    where: { adminUserId: user.id },
  });
  console.log(`Super admin @${input!.username} siap digunakan.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
