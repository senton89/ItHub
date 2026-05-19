import { prisma } from '@/lib/prisma'

export async function GET() {
  const healthcheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    status: 'ok',
    version: '1.0.0'
  }
  
  try {
    // Проверка подключения к SQLite
    await prisma.$queryRaw`SELECT 1`
    healthcheck.database = 'connected'
  } catch (error) {
    healthcheck.status = 'error'
    healthcheck.database = 'disconnected'
    healthcheck.error = error.message
  }
  
  const statusCode = healthcheck.status === 'ok' ? 200 : 503
  return Response.json(healthcheck, { status: statusCode })
}
