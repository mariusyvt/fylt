"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Nutrients } from "@/types/nutrition.types";
import { searchByBarcode } from "@/api/services/openfoodfacts.service";
import { getFoodByBarcode, foodToNutrients } from "@/api/services/foods.service";
import { useAuth } from "@/hooks/useAuth";

export const useBarcodeScanner = (
    onScanSuccess?: (nutrients: Nutrients) => void
) => {
    const { token } = useAuth();
    const [scanning, setScanning] = useState(false);
    const [codeBar, setCodeBar] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isMountedRef = useRef(true);

    const startScanner = useCallback(async () => {
        try {
            setError(null);
            scannerRef.current = new Html5Qrcode("reader");
            setScanning(true);

            await scannerRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                async (decodedText) => {
                    setCodeBar(decodedText);
                    setIsLoading(true);

                    if (scannerRef.current) {
                        await scannerRef.current.stop();
                        if (isMountedRef.current) setScanning(false);
                    }

                    const food = token ? await getFoodByBarcode(token, decodedText) : null;
                    const nutrients = food ? foodToNutrients(food) : await searchByBarcode(decodedText);
                    if (!isMountedRef.current) return;
                    setIsLoading(false);

                    if (nutrients && onScanSuccess) {
                        onScanSuccess(nutrients);
                    } else if (!nutrients) {
                        setError("Produit non trouvé");
                    }
                },
                () => {}
            );
        } catch {
            if (!isMountedRef.current) return;
            setError("Impossible d'accéder à la caméra");
            setScanning(false);
        }
    }, [onScanSuccess, token]);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            await scannerRef.current.stop();
            if (isMountedRef.current) setScanning(false);
        }
    }, []);

    // Coupe la caméra si le composant est démonté pendant un scan
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
                scannerRef.current = null;
            }
        };
    }, []);

    return {
        scanning,
        codeBar,
        isLoading,
        error,
        startScanner,
        stopScanner,
    };
};

