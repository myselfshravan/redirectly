import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware placeholder (auth disabled).
 */
export function middleware(request: NextRequest) {
  void request;
  return NextResponse.next();
}

// Configure which paths to run middleware on
export const config = {
  matcher: ['/dashboard/:path*'],
};
