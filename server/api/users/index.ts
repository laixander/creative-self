import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    })
    return users
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        roleId: body.roleId || null,
      },
      include: { role: true }
    })
    return user
  }
})
