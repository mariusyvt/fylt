"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";

interface DeviceGateProps {
    children: React.ReactNode;
}

export default function DeviceGate({ children }: DeviceGateProps) {
    const pathname = usePathname();
    const [isDesktop, setIsDesktop] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) || window.innerWidth < 768;
            setIsDesktop(!isMobile);
            setChecked(true);
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    const isLegalRoute = pathname?.startsWith("/legal");

    if (isLegalRoute) return <>{children}</>;

    if (!checked) return null;

    if (isDesktop) return <LandingPage />;

    return <>{children}</>;
}
