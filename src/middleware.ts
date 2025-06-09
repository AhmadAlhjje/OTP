import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const pathname = request.nextUrl.pathname;

  // حماية صفحات لوحة التحكم
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/settings")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // إعادة توجيه المسجلين تلقائيًا
  if (token) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard/send_whatsapp", request.url));
    }
  }

  return NextResponse.next();
}
