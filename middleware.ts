import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Protect admin routes (dashboard, products, orders, etc.)
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/orders') || 
      pathname.startsWith('/products') ||
      pathname.startsWith('/themes') ||
      pathname.startsWith('/variants')) {
    const role = req.cookies.get('role')?.value;
    
    if (role !== 'ADMIN') {
      // Redirect to admin login page
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*', '/products/:path*', '/themes/:path*', '/variants/:path*']
};
