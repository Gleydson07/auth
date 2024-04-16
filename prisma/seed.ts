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
      password: '$2b$12$qf/h360WYrevBdC5fVgXYuzx4O6MsysqEQ4e3yDYV5ZhfAAOIaJDq',
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
