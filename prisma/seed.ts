import { PrismaClient } from "@prisma/client";
import { users, invoices } from "../lib/placeholder-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clear existing data
  await prisma.invoice.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  console.log("Creating users...");
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
  console.log("Users created successfully");

  // Seed invoices
  console.log("Creating invoices...");
  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: invoice,
    });
  }
  console.log("Invoices created successfully");

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
