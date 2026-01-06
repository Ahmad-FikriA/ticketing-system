import { PrismaClient } from "../generated/prisma/class.ts";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.ticket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
    },
  });

  // Create ticket types
  const vipTicket = await prisma.ticketType.create({
    data: {
      name: 'VIP',
      price: 15000, // in cents = $150
      quota: 50,
      soldCount: 0,
    },
  });

  const regularTicket = await prisma.ticketType.create({
    data: {
      name: 'Regular',
      price: 5000, // in cents = $50
      quota: 200,
      soldCount: 0,
    },
  });

  const studentTicket = await prisma.ticketType.create({
    data: {
      name: 'Student',
      price: 2500, // in cents = $25
      quota: 100,
      soldCount: 0,
    },
  });

  console.log('✅ Seed data created successfully!');
  console.log('\nTest User IDs:');
  console.log(`User 1: ${user1.id}`);
  console.log(`User 2: ${user2.id}`);
  console.log('\nTicket Type IDs:');
  console.log(`VIP: ${vipTicket.id}`);
  console.log(`Regular: ${regularTicket.id}`);
  console.log(`Student: ${studentTicket.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
