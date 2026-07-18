import { auth } from "@/lib/auth";

const PROTECTED_PREFIXES = ["/cart", "/checkout", "/orders", "/account"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => req.nextUrl.pathname.startsWith(prefix));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/orders/:path*", "/account/:path*"],
};
