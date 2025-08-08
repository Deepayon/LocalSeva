const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'deepayandas42@gmail.com' },
      select: { id: true, email: true, role: true }
    });

    console.log('Admin user found:', adminUser);

    // If role is not admin, update it
    if (adminUser && adminUser.role !== 'admin') {
      console.log('Updating admin role...');
      const updatedUser = await prisma.user.update({
        where: { email: 'deepayandas42@gmail.com' },
        data: { role: 'admin' },
        select: { id: true, email: true, role: true }
      });
      console.log('Updated admin user:', updatedUser);
    } else if (adminUser && adminUser.role === 'admin') {
      console.log('Admin user already has correct role');
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();