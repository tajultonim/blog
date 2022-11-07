import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import verifier from "./jwt/jwtverifier";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (request.url.endsWith("admin")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  let token: any = request.cookies.get("access_token")?.value;
  let verres = await verifier(token);

  if (
    request.url.endsWith("login") ||
    (verres.status == "success" && verres.payload?.claims?.admin)
  ) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin/:path*",
};
