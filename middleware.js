import { auth } from "@/lib/auth";

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/admin") && !req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    req.auth?.user?.role !== "ADMIN"
  ) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
