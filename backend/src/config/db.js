import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error"], // কুয়েরি এবং এরর লগ দেখাবে
});

export default prisma;
