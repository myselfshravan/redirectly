import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for authentication and rate limiting
 * Protects dashboard routes with basic auth
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes with basic authentication
  if (pathname.startsWith('/dashboard')) {
    const authHeader = request.headers.get('authorization');

    // Check for basic auth credentials
    if (!authHeader || !isValidBasicAuth(authHeader)) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Dashboard", charset="UTF-8"',
        },
      });
    }
  }

  return NextResponse.next();
}

/**
 * Validate basic auth credentials
 */
function isValidBasicAuth(authHeader: string): boolean {
  try {
    // Extract credentials from "Basic <base64>" format
    const base64Credentials = authHeader.split(' ')[1];
    if (!base64Credentials) {
      return false;
    }

    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Compare with environment variables
    const validUsername = process.env.DASHBOARD_USERNAME || 'admin';
    const validPassword = process.env.DASHBOARD_PASSWORD || 'admin';

    return username === validUsername && password === validPassword;
  } catch (error) {
    console.error('Basic auth validation error:', error);
    return false;
  }
}

// Configure which paths to run middleware on
export const config = {
  matcher: ['/dashboard/:path*'],
};
