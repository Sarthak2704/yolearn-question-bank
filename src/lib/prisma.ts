import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  // If PostgreSQL or remote DB, return as is
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // On Vercel / serverless environment
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      // Look for bundled dev.db
      const potentialPaths = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join(__dirname, 'prisma', 'dev.db'),
      ];

      for (const p of potentialPaths) {
        if (fs.existsSync(p)) {
          try {
            fs.copyFileSync(p, tmpDbPath);
            break;
          } catch (e) {
            console.error('Failed to copy db to /tmp:', e);
          }
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  return envUrl;
}

const dbUrl = getDatabaseUrl();

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
