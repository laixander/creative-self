import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return roles
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const role = await prisma.role.create({
      data: {
        name: body.name,
        description: body.description,
      }
    })
    return role
  }
})
