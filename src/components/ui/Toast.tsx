"use client";

import { CheckCircle } from "lucide-react";

interface ToastProps {
    message: string;
}

export default function Toast({ message }: ToastProps) {
    return (
        <div className="toast" role="status" aria-live="polite">
            <CheckCircle size={18} />
            <span>{message}</span>
        </div>
    );
}
