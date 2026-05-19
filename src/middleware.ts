import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 🚫 Блокируем seed endpoints в production
  if (pathname.startsWith('/api/seed') || pathname.startsWith('/api/qa-seed')) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Endpoint disabled in production' },
        { status: 403 }
      )
    }
  }
  
  // 🔒 Добавляем security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    '/api/seed/:path*',
    '/api/qa-seed/:path*',
    '/api/upload/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
