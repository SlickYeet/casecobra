import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { generateId } from "lucia"

const prisma = new PrismaClient()

export const main = async () => {
  const password = await hash("Pass1234!", 12)
  const userId = generateId(15)

  await prisma.user.create({
    data: {
      id: userId,
      username: "testUser",
      email: "test@famlam.ca",
      password,
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    process.exit(1)
  })
