import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id as string)

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  if (method === 'GET') {
    const user = await prisma.user.findUnique({ where: { id }, include: { role: true } })
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
    return user
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        roleId: body.roleId || null,
      },
      include: { role: true }
    })
    return user
  }

  if (method === 'DELETE') {
    await prisma.user.delete({ where: { id } })
    return { success: true }
  }
})
