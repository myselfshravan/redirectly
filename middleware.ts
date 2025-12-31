import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Credentials from environment variables
const VALID_USERNAME = process.env.DASHBOARD_USERNAME;
const VALID_PASSWORD = process.env.DASHBOARD_PASSWORD;

function isValidCredentials(authHeader: string | null): boolean {
  if (!VALID_USERNAME || !VALID_PASSWORD) {
    return false; // Block access if env vars not configured
  }

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  return username === VALID_USERNAME && password === VALID_PASSWORD;
}

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!isValidCredentials(authHeader)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Dashboard Access"',
      },
    });
  }

  return NextResponse.next();
}

// Configure which paths to run middleware on
export const config = {
  matcher: ['/dashboard/:path*'],
};
