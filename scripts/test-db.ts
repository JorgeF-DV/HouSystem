import { config } from "dotenv";
config({ path: ".env.local" });

import pg from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const url = process.env.DATABASE_URL;
  console.log("URL:", url ? url.slice(0, 40).replace(/:[^:]*@/, ":***@") : "undefined");

  const cleanUrl = url!.replace(/\?.*/, ""); // remove sslmode from URL
  const pool = new pg.Pool({ connectionString: cleanUrl, ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log("Connection OK:", JSON.stringify(result));
  } catch (e) {
    console.error("Connection failed:", e instanceof Error ? e.message : e);
  }
  await prisma.$disconnect();
}
main();
