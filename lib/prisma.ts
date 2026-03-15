import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

const databaseUrl = process.env.DATABASE_URL ?? 'mysql://root:root@localhost:3306/placeholder';
const adapter = new PrismaMariaDb(databaseUrl);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


