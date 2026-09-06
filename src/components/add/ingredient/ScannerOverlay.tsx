"use client";

import { X } from "lucide-react";
import { BarcodeScanner } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import type { DetectedBarcode } from "react-barcode-scanner";
import { BARCODE_FORMATS } from "@/hooks/useBarcodeScanner";

interface ScannerOverlayProps {
    onCapture: (barcodes: DetectedBarcode[]) => void;
    onCameraError: (error: Error) => void;
    onClose: () => void;
}

// Chargé dynamiquement (next/dynamic, ssr:false) : react-barcode-scanner et son
// polyfill ne sont téléchargés qu'à l'ouverture du scanner.
export default function ScannerOverlay({ onCapture, onCameraError, onClose }: ScannerOverlayProps) {
    return (
        <div className="scanner-overlay">
            <div className="scanner-overlay__header">
                <button type="button" className="scanner-overlay__close" onClick={onClose}>
                    <X size={22} />
                </button>
                <span className="scanner-overlay__title">Scanner un produit</span>
            </div>
            <div className="scanner-overlay__viewport">
                <BarcodeScanner
                    id="reader"
                    options={{ formats: BARCODE_FORMATS, delay: 500 }}
                    onCapture={onCapture}
                    onCameraError={onCameraError}
                    trackConstraints={{ facingMode: "environment" }}
                />
                <div className="scanner-overlay__frame" />
            </div>
            <p className="scanner-overlay__hint">Placez le code-barres dans le cadre</p>
        </div>
    );
}
