import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session.token")?.value ||
    req.cookies.get("__Secure-next-auth.session.token")?.value;

  const isAccountPage = req.nextUrl.pathname.startsWith("/account");
  const isCheckoutPage = req.nextUrl.pathname.startsWith("/checkout");
  const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin");

  if ((isAccountPage || isCheckoutPage || isAdminApi) && !token) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout", "/api/admin/:path*"],
};
