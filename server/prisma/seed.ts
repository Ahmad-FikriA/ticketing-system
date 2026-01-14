import { prisma } from "../lib/prisma.ts";
import bcrypt from 'bcrypt';

async function main() {
  // Clean up existing data
  await prisma.payment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('👤 Admin created: admin@example.com / admin123');

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

  console.log('🎫 Ticket types created: VIP, Regular, Student');
  console.log('✅ Seed data created successfully!');
  console.log('\nAdmin Login:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
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
