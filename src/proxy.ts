import { NextResponse, type NextRequest } from "next/server";

// Global 404s bypass route layouts. Carry only the URL's language to that shell.
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const path = request.nextUrl.pathname;
  headers.set("x-portfolio-locale", path === "/es" || path.startsWith("/es/") ? "es" : "en");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next/|media/|fonts/|documents/|icon.svg|robots.txt|sitemap.xml).*)"] };
