import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The auth session is issued by the API on api.fylt.fr and is not readable from
// the public Next.js origin. Redirects based on a cross-domain cookie would be
// incorrect and cause loops. The session is therefore checked in client code.
export function middleware(_request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons|offline).*)",
    ],
};
