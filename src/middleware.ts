import NextAuth from "next-auth";
import authConfig from "@/server/auth.config";
import {
  apiAuthPrefix, 
  authRoutes,
  publicRoutes,
  DEFAULT_LOGIN_REDIRECT_URL,
} from "@/server/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_URL, nextUrl));
    }

    return null;
  }

  if (!isLoggedIn && !isPublicRoutes) { 
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;

})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}