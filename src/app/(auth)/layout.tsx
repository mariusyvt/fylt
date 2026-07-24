"use client"

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_AUTH_ROUTES = ["/verify-email", "/reset-password"];

export default function AuthLayout ({children}: { children: React.ReactNode }) {
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isPublicRoute = PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));

    useEffect(() => {
        if (isAuthenticated && !isPublicRoute) {
            router.push('/');
        }
    }, [isAuthenticated, isPublicRoute, router]);

    if (isAuthenticated && !isPublicRoute) return null;

    return <>{children}</>;
}