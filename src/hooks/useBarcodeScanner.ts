"use client";

import { useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Nutrients } from "@/types/nutrition.types";
import { searchByBarcode } from "@/api/services/openfoodfacts.service";

export const useBarcodeScanner = (
    onScanSuccess?: (nutrients: Nutrients) => void
) => {
    const [scanning, setScanning] = useState(false);
    const [codeBar, setCodeBar] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scannerRef = useRef<Html5Qrcode | null>(null);

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
                        setScanning(false);
                    }

                    const nutrients = await searchByBarcode(decodedText);
                    setIsLoading(false);

                    if (nutrients && onScanSuccess) {
                        onScanSuccess(nutrients);
                    } else if (!nutrients) {
                        setError("Produit non trouvé");
                    }
                },
                () => {}
            );
        } catch (err) {
            setError("Impossible d'accéder à la caméra");
            setScanning(false);
        }
    }, [onScanSuccess]);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            await scannerRef.current.stop();
            setScanning(false);
        }
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

