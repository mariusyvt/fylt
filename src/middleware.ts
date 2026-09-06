import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "fylt.session_token";

/** Routes d'authentification accessibles sans session. */
const AUTH_ROUTES = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
];

/** Routes auth qui restent accessibles même connecté (via lien email). */
const PUBLIC_AUTH_ROUTES = ["/verify-email", "/reset-password"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // Non connecté sur une page protégée → redirection vers /signin
    if (!hasSession && !isAuthRoute && pathname !== "/offline") {
        const url = request.nextUrl.clone();
        url.pathname = "/signin";
        return NextResponse.redirect(url);
    }

    // Connecté sur une page d'auth (hors liens email) → redirection vers l'accueil
    if (hasSession && isAuthRoute && !isPublicAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Toutes les routes sauf API, assets internes Next, et fichiers statiques
        "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons|offline).*)",
    ],
};
