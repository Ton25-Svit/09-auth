import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "./lib/api/serverApi";
import { parse } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const res = await checkServerSession();
      const resCookie = res?.headers?.["set-cookie"];

      if (resCookie) {
        let response: NextResponse;

        if (isPublicRoute) {
          response = NextResponse.redirect(new URL("/", request.url));
        } else {
          response = NextResponse.next();
        }

        const cookieArray = Array.isArray(resCookie) ? resCookie : [resCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: parsed["Max-Age"]
              ? Number(parsed["Max-Age"])
              : undefined,
          };

          if (parsed.accessToken) {
            response.cookies.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            response.cookies.set("refreshToken", parsed.refreshToken, options);
          }
        }

        return response;
      }
    } catch (e) {
      console.error("Session refresh failed", e);
    }
  }

  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
