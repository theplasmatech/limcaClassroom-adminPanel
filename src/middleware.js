import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/password';

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.get('adminAuthenticated')?.value === 'true';

  // Redirect to password page if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/password', request.url));
  }

  // Redirect to home if authenticated and trying to access password page
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 