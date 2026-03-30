import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Pass through all requests
  // Auth is handled in server components and server actions
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
