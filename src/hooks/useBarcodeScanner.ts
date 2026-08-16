"use client";

import { useState, useRef, useCallback } from "react";
import type { DetectedBarcode } from "react-barcode-scanner";
import { Nutrients } from "@/types/nutrition.types";
import { searchByBarcode } from "@/api/services/openfoodfacts.service";
import { getFoodByBarcode, foodToNutrients } from "@/api/services/foods.service";
import { useAuth } from "@/hooks/useAuth";

export const BARCODE_FORMATS = [
    "ean_13",
    "ean_8",
    "upc_a",
    "upc_e",
    "code_128",
    "code_39",
    "itf",
];

export const useBarcodeScanner = (
    onScanSuccess?: (nutrients: Nutrients) => void
) => {
    const { token } = useAuth();
    const [scanning, setScanning] = useState(false);
    const [codeBar, setCodeBar] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handledRef = useRef(false);

    const startScanner = useCallback(() => {
        setError(null);
        setCodeBar("");
        handledRef.current = false;
        setScanning(true);
    }, []);

    const stopScanner = useCallback(() => {
        setScanning(false);
    }, []);

    const handleCapture = useCallback(
        async (barcodes: DetectedBarcode[]) => {
            if (handledRef.current || !barcodes?.length) return;
            const decodedText = barcodes[0].rawValue;
            if (!decodedText) return;

            handledRef.current = true;
            setCodeBar(decodedText);
            setIsLoading(true);
            setScanning(false);

            try {
                const food = token ? await getFoodByBarcode(token, decodedText) : null;
                const nutrients = food ? foodToNutrients(food) : await searchByBarcode(decodedText);
                setIsLoading(false);

                if (nutrients && onScanSuccess) {
                    onScanSuccess(nutrients);
                } else if (!nutrients) {
                    setError("Produit non trouvé");
                }
            } catch {
                setIsLoading(false);
                setError("Produit non trouvé");
            }
        },
        [token, onScanSuccess]
    );

    const handleCameraError = useCallback(() => {
        setError("Impossible d'accéder à la caméra");
        setScanning(false);
    }, []);

    return {
        scanning,
        codeBar,
        isLoading,
        error,
        startScanner,
        stopScanner,
        handleCapture,
        handleCameraError,
    };
};
