import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Admin',
      lastname: 'Administrator',
      email: 'admin@admin.com',
      password: '$2b$12$tvx9oonDftRI7nz6H21pMevwl1PXu5DNvUDD3Yo1cwSTo2wj2Nk/y', //admin
      role: "ADMIN"
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
