"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/landing/LandingPage";

interface DeviceGateProps {
    children: React.ReactNode;
}

export default function DeviceGate({ children }: DeviceGateProps) {
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

    if (!checked) return null;

    if (isDesktop) return <LandingPage />;

    return <>{children}</>;
}
