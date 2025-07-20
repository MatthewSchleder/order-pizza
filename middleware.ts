// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const AUTH_PASSWORD = process.env.AUTH_PASSWORD

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const password = req.cookies.get('password')?.value

  if (
    url.pathname === '/login' ||
    url.pathname.startsWith('/_next') ||
    url.pathname === '/favicon.ico' ||
    url.pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  if (password !== AUTH_PASSWORD) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|_next|favicon.ico|api).*)'],
}
