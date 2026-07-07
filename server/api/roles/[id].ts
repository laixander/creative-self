import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id as string)

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  if (method === 'GET') {
    const role = await prisma.role.findUnique({ where: { id } })
    if (!role) throw createError({ statusCode: 404, statusMessage: 'Role not found' })
    return role
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const role = await prisma.role.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      }
    })
    return role
  }

  if (method === 'DELETE') {
    await prisma.role.delete({ where: { id } })
    return { success: true }
  }
})
